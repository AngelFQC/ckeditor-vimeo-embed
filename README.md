# CKEditor Vimeo Embed

Plugin for CKEditor to upload videos to vimeo and embed them.

## Integration with PHP

Edit `integration/config.php` file and set the params with _Client identifier_ (`client_id`), _Client secret_ (`client_secret`) and _Personal Access Tokens_ (`access_token`).
This values are created and managed in https://developer.vimeo.com/apps.

The access token must be _authenticated_ and must have the scopes of `public`, `private`, `edit` and `upload`.

