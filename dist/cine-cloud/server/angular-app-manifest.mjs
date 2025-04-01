
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/register"
  },
  {
    "renderMode": 2,
    "route": "/subir/2"
  },
  {
    "renderMode": 2,
    "route": "/server/config"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 16096, hash: '77b3e5ccd30f2bc48c069848f4170ee4915cef6112fe9e850ca4ce7c12902e16', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1006, hash: 'd3b57c3d404480d4d91577cc39982c5b2e1c24d03d553c1a3f3f9dc71cadddeb', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 45309, hash: 'e85a0f37eb56c63352580401207af621553a596b8b818bfc3e4a3816d36424a1', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'server/config/index.html': {size: 44348, hash: '68bd3583c95c3fc80e92f16629e3e46b533f770c0931d29877ef447c61e52c86', text: () => import('./assets-chunks/server_config_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 45309, hash: 'e85a0f37eb56c63352580401207af621553a596b8b818bfc3e4a3816d36424a1', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 47036, hash: 'dc6c624bc6c263fb0a110c1562fd46d088531e532a9b4f3a2d33dbe920687512', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'subir/2/index.html': {size: 45309, hash: 'e85a0f37eb56c63352580401207af621553a596b8b818bfc3e4a3816d36424a1', text: () => import('./assets-chunks/subir_2_index_html.mjs').then(m => m.default)},
    'styles-Q6SGCVYV.css': {size: 70975, hash: 'daMxvZf58LQ', text: () => import('./assets-chunks/styles-Q6SGCVYV_css.mjs').then(m => m.default)}
  },
};
