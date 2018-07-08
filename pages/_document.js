import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <title>PDC</title>
          <link rel="icon" href="/static/images/favicon.ico" type="image/x-icon" />
          
          <link rel="stylesheet" href="/_next/static/style.css" />
          <link rel="stylesheet" href="/static/plugins/bootstrap/dist/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/static/icon/icofont/css/icofont.css" />
          <link rel="stylesheet" href="/static/css/style.css" />


          <link rel="stylesheet" type="text/css" href="/static/icon/themify-icons/themify-icons.css" />
          <link rel="stylesheet" type="text/css" href="/static/pages/flag-icon/flag-icon.min.css" />
          <link rel="stylesheet" type="text/css" href="/static/pages/menu-search/css/component.css" />
          <link rel="stylesheet" type="text/css" href="/static/pages/dashboard/amchart/css/amchart.css" />
          <link rel="stylesheet" type="text/css" href="/static/pages/dashboard/horizontal-timeline/css/style.css" />
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
          <script type="text/javascript" src="/static/plugins/modernizr/modernizr.js"></script>
          <script type="text/javascript" src="/static/plugins/modernizr/feature-detects/css-scrollbars.js"></script>
          <script type="text/javascript" src="/static/plugins/classie/classie.js"></script>
          <script src="/static/plugins/morris.js/morris.js"></script>
          <script type="text/javascript" src="/static/pages/dashboard/horizontal-timeline/js/main.js"></script>
          <script type="text/javascript" src="/static/pages/dashboard/amchart/js/amcharts.js"></script>
          <script type="text/javascript" src="/static/pages/dashboard/amchart/js/serial.js"></script>
          <script type="text/javascript" src="/static/pages/dashboard/amchart/js/light.js"></script>
          <script type="text/javascript" src="/static/pages/dashboard/amchart/js/custom-amchart.js"></script>
          <script type="text/javascript" src="/static/plugins/i18next/i18next.min.js"></script>
          <script type="text/javascript" src="/static/plugins/i18next-xhr-backend/i18nextXHRBackend.min.js"></script>
          <script type="text/javascript" src="/static/plugins/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js"></script>
          <script type="text/javascript" src="/static/plugins/jquery-i18next/jquery-i18next.min.js"></script>
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