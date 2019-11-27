import { param, deparam } from './deparam';
import { ResizeMessage } from './measure';

// slice access token from query string
const params = deparam(location.search.substr(1));
const token = params.yttringar;
if (token) {
  delete params.yttringar;
  let search = param(params);
  if (search.length) {
    search = '?' + search;
  }
  history.replaceState(undefined, document.title, location.pathname + search + location.hash);
}

let script = document.currentScript as HTMLScriptElement;
if (script === undefined) {
  // Internet Explorer :(
  // tslint:disable-next-line:max-line-length
  script = document.querySelector('script[src^="http://localhost:4000/client.js"]') as HTMLScriptElement; // TODO: add script[src^=] when hosted externally
}

// gather script element's attributes
const attrs: Record<string, string> = {};
for (let i = 0; i < script.attributes.length; i++) {
  const attribute = script.attributes.item(i)!;
  attrs[attribute.name.replace(/^data-/, '')] = attribute.value; // permit using data-theme instead of theme.
}

// gather page attributes
const canonicalLink = document.querySelector(`link[rel='canonical']`) as HTMLLinkElement;
attrs.url = canonicalLink ? canonicalLink.href : location.origin + location.pathname + location.search;
attrs.origin = location.origin;
attrs.pathname = location.pathname.length < 2 ? 'index' : location.pathname.substr(1).replace(/\.\w+$/, '');
attrs.title = document.title;
const descriptionMeta = document.querySelector(`meta[name='description']`) as HTMLMetaElement;
attrs.description = descriptionMeta ? descriptionMeta.content : '';
const ogtitleMeta = document.querySelector(`meta[property='og:title'],meta[name='og:title']`) as HTMLMetaElement;
attrs['og:title'] = ogtitleMeta ? ogtitleMeta.content : '';
attrs.token = token;

// create the standard yttringar styles and insert them at the beginning of the
// <head> for easy overriding.
// NOTE: the craziness with "width" is for mobile safari :(
document.head.insertAdjacentHTML(
  'afterbegin',
  `<style>
    .yttringar {
      position: relative;
      box-sizing: border-box;
    }
    .yttringar-frame {
      position: absolute;
      left: 0;
      right: 0;
      width: 1px;
      min-width: 100%;
      max-width: 100%;
      height: 100%;
      border: 0;
    }
  </style>`);

// create the comments iframe and it's responsive container
const yttringarOrigin = script.src.replace('/client.js', '')
const url = `${yttringarOrigin}/yttringar.html`;
script.insertAdjacentHTML(
  'afterend',
  `<div class="yttringar">
    <iframe class="yttringar-frame" id="yttringar-frame" title="Comments" scrolling="no" src="${url}?${param(attrs)}"></iframe>
  </div>`);
const container = script.nextElementSibling as HTMLDivElement;
script.parentElement!.removeChild(script);

// adjust the iframe's height when the height of it's content changes
addEventListener('message', event => {
  if (event.origin !== yttringarOrigin) {
    return;
  }
  const data = event.data as ResizeMessage;
  if (data && data.type === 'resize' && data.height) {
    container.style.height = `${data.height}px`;
  }
});
