document.addEventListener('DOMContentLoaded', function () {

  // Remove styling
  ;[].forEach.call(document.querySelectorAll('style'), function(x){ x.parentNode.removeChild(x) })

  // Inject error message
  document.body.innerHTML =
    '<style>body{margin:0;padding:0}' +
            'h1{background:#E94C43;color:#fff;padding:1.4rem 2rem;margin:0;word-break:break-word;}' +
           'pre{font-size:1.25rem;word-wrap:break-word;padding:2rem 2rem 1.1rem}</style>' +
    '<h1>' + stack[0] + '</h1>' +
    '<pre style="background: #424242;color: white;margin:0;box-shadow:inset 0px 0px 0.7rem rgba(0,0,0,0.50)">' +
      file + ':\n\n' +
      snippet +
    '</pre>' +
    '<pre>' + stack.slice(1).map(formatLine).join('\n') + '</pre>'
  ;

  function formatLine (line) {
    return line.replace(/\/([^:\/]+:[0-9]+)/, '/<b>$1</b>');
  }
})
