import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <title>PDC</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui" />
          <link rel="icon" href="/static/images/pdc_icon.png" type="image/x-icon" />
          
          <link rel="stylesheet" href="/_next/static/style.css" />
          <link rel="stylesheet" href="/static/plugins/bootstrap/dist/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/static/icon/icofont/css/icofont.css" />
          <link rel="stylesheet" href="/static/css/style.css" />
          <link rel="stylesheet" href="/static/css/tutorial_badge.css" />
          <link rel="stylesheet" type="text/css" href="/static/pages/notification/notification.css" />

          <link rel="stylesheet" type="text/css" href="/static/icon/themify-icons/themify-icons.css" />
          <link rel="stylesheet" type="text/css" href="/static/pages/flag-icon/flag-icon.min.css" />
          <link rel="stylesheet" type="text/css" href="/static/pages/menu-search/css/component.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/linearicons.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/simple-line-icons.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/jquery.mCustomScrollbar.css" />

          <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
          <script type="text/javascript" src="/static/plugins/jquery-ui/jquery-ui.min.js"></script>
          <script src="/static/js/pcoded.min.js"></script>
          <script src="/static/js/jquery.mCustomScrollbar.concat.min.js"></script>
          <script type="text/javascript" src="/static/plugins/tether/dist/js/tether.min.js"></script>
          <script type="text/javascript" src="/static/plugins/bootstrap/dist/js/bootstrap.min.js"></script>
          <script type="text/javascript" src="/static/plugins/jquery-slimscroll/jquery.slimscroll.js"></script>
          <script src="/static/plugins/morris.js/morris.js"></script>
          <script type="text/javascript" src="/static/pages/dashboard/horizontal-timeline/js/main.js"></script>
          <script type="text/javascript" src="/static/js/bootstrap-growl.min.js"></script>
          <script type="text/javascript" src="/static/pages/dashboard/custom-dashboard.js"></script>
          <script type="text/javascript" src="/static/js/script.js"></script>
          <script src="/static/js/jquery.mousewheel.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />

          <script src="/static/js/demo-12.js"></script>
        </body>
      </html>
    )
  }
}