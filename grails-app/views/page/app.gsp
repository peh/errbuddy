<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Errbuddy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon" href="${asset.assetPath(src: "favicon.ico")}" type="image/x-icon">
  <script type="text/javascript">
    window.upstream = '${grailsApplication.config.errbuddy.upstream ?: "http://${grailsApplication.config.server.host ?: 'localhost'}:${grailsApplication.config.server.port ?: 9000}"}'
  </script>
  <babel:webpack src="app.es6"/>
</head>

<body>
<div id="app-body"></div>
</body>
</html>
