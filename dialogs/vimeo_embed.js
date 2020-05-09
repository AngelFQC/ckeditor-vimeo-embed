(function () {
    CKEDITOR.dialog.add(
        'vimeoEmbedDialog',
        function (editor) {
            var lang = editor.lang.ckeditor_vimeo_embed;

            function post(url, data, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open( 'POST', url, true );
                xhr.onreadystatechange = function() {
                    if ( xhr.readyState == 4 ) {
                        callback();
                        xhr = null;
                    }
                };
                xhr.send(data);

                return xhr;
            }

            var stillUploading = false;
            var xhrPost = null;

            return {
                title: 'Vimeo Embed',
                minWidth: 600,
                minHeight: 400,
                contents: [
                    {
                        id: 've-basic',
                        title: lang.upload,
                        label: lang.upload,
                        elements: [
                            {
                                type: 'text',
                                id: 'title',
                                label: lang.title,
                            },
                            {
                                type: 'textarea',
                                id: 'description',
                                label: lang.description
                            },
                            {
                                type: 'html',
                                html: '<input id="ve-file" type="file" accept="video/*">'
                            },
                            {
                                type: 'vbox',
                                children: [
                                    {
                                        type: 'checkbox',
                                        id: 'privacy-download',
                                        label: lang.privacyDownload
                                    },
                                    {
                                        type: 'hbox',
                                        widths: ['65%', '35%'],
                                        children: [
                                            {
                                                type: 'select',
                                                id: 'privacy-embed',
                                                label: lang.privacyEmbed,
                                                items: [
                                                    [lang.privacyEmbedPrivate, 'private'],
                                                    [lang.privacyEmbedPublic, 'public'],
                                                    [lang.privacyEmbedWhitelist, 'whitelist'],
                                                ],
                                                'default': 'private'
                                            },
                                            {
                                                type: 'text',
                                                id: 'privacy-embed-whitelist',
                                                label: lang.privacyEmbedWhitelistList,
                                                validate: function () {
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        type: 'select',
                                        id: 'privacy-view',
                                        label: lang.privacyView,
                                        items: [
                                            [lang.privacyViewAnybody, 'anybody'],
                                            [lang.privacyViewContacts, 'contacts'],
                                            [lang.privacyViewDisable, 'disable'],
                                            [lang.privacyViewNobody, 'nobody'],
                                            [lang.privacyViewUnlisted, 'unlisted'],
                                            // [lang.privacyViewPassword, 'password'],
                                            // [lang.privacyViewUsers, 'users'],
                                        ],
                                        'default': 'unlisted'
                                    }
                                ]
                            },
                            {
                                type: 'button',
                                id: 'submit',
                                label: lang.uploadFile,
                                title: lang.uploadFile,
                                onClick: function () {
                                    var dialog = this.getDialog();

                                    var title = dialog.getValueOf('ve-basic', 'title').trim();
                                    var description = dialog.getValueOf('ve-basic', 'description').trim();
                                    var privacyDownload = dialog.getValueOf('ve-basic', 'privacy-download');
                                    var privacyEmbed = dialog.getValueOf('ve-basic', 'privacy-embed');
                                    var privacyEmbedWhiteList = dialog.getValueOf('ve-basic', 'privacy-embed-whitelist').trim();
                                    var privacyView = dialog.getValueOf('ve-basic', 'privacy-view');
                                    var files = document.getElementById('ve-file').files;

                                    if ((!title || !title.length) ||
                                        //(!description || !description.length) ||
                                        (!files || files.length !== 1)
                                    ) {
                                        return;
                                    }

                                    stillUploading = true;

                                    var formData = new FormData();
                                    formData.append('title', title);
                                    formData.append('description', description);
                                    formData.append('ve_file', files[0], files[0].name);
                                    formData.append('privacy_download', privacyDownload);
                                    formData.append('privacy_embed', privacyEmbed);
                                    formData.append('privacy_embed_whitelist', privacyEmbedWhiteList);
                                    formData.append('privacy_view', privacyView);

                                    xhrPost = post(
                                        CKEDITOR.plugins.getPath('ckeditor_vimeo_embed') + 'integration/upload.php',
                                        formData,
                                        function () {
                                            stillUploading = false;
                                        }
                                    );
                                }
                            }
                        ]
                    },
                ],
                onOk: function () {
                    if (stillUploading) {
                        alert(lang.alertStillUploading);

                        return false;

                    }

                    if (xhrPost) {
                        var json = JSON.parse(xhrPost.response);

                        if (json.error) {
                            alert(json.message);
                        } else {
                            editor.insertHtml(json.embed);
                        }
                    }

                    xhrPost = null;

                    document.getElementById('ve-file').value = null;
                },
                onCancel: function () {
                    if (xhrPost) {
                        xhrPost.abort();
                    }

                    document.getElementById('ve-file').value = null;
                }
            };
        }
    );
})();
