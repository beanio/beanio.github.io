(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{117:function(e,t,a){"use strict";const n=(e,{target:t=document.body}={})=>{const a=document.createElement("textarea"),n=document.activeElement;a.value=e,a.setAttribute("readonly",""),a.style.contain="strict",a.style.position="absolute",a.style.left="-9999px",a.style.fontSize="12pt";const r=document.getSelection();let o=!1;r.rangeCount>0&&(o=r.getRangeAt(0)),t.append(a),a.select(),a.selectionStart=0,a.selectionEnd=e.length;let c=!1;try{c=document.execCommand("copy")}catch(l){}return a.remove(),o&&(r.removeAllRanges(),r.addRange(o)),n&&n.focus(),c};e.exports=n,e.exports.default=n},118:function(e,t){function a(e){let t,a=[];for(let n of e.split(",").map((e=>e.trim())))if(/^-?\d+$/.test(n))a.push(parseInt(n,10));else if(t=n.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){let[e,n,r,o]=t;if(n&&o){n=parseInt(n),o=parseInt(o);const e=n<o?1:-1;"-"!==r&&".."!==r&&"\u2025"!==r||(o+=e);for(let t=n;t!==o;t+=e)a.push(t)}}return a}t.default=a,e.exports=a},75:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(86),c=a(21),l=a(24),i=a(87),s=a(3),u=a(7),p=a(78),m=a(77),d=a(91),h=a(95),b=a(96),y=a(94),f=a(80),g=a(84),v=a(98),k=function(e){return r.a.createElement("svg",Object(s.a)({width:"20",height:"20",role:"img"},e),r.a.createElement("g",{fill:"#7a7a7a"},r.a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),r.a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))},j=a(97),O=a(65),E=a.n(O);var C=function e(t,a){return"link"===t.type?Object(m.isSamePath)(t.href,a):"category"===t.type&&t.items.some((function(t){return e(t,a)}))};function N(e){var t,a,o,c=e.item,l=e.onItemClick,i=e.collapsible,m=e.activePath,d=Object(u.a)(e,["item","onItemClick","collapsible","activePath"]),h=c.items,b=c.label,y=C(c,m),f=(a=y,o=Object(n.useRef)(a),Object(n.useEffect)((function(){o.current=a}),[a]),o.current),g=Object(n.useState)((function(){return!!i&&(!y&&c.collapsed)})),v=g[0],k=g[1],j=Object(n.useRef)(null),O=Object(n.useState)(void 0),N=O[0],x=O[1],T=function(e){var t;void 0===e&&(e=!0),x(e?(null===(t=j.current)||void 0===t?void 0:t.scrollHeight)+"px":void 0)};Object(n.useEffect)((function(){y&&!f&&v&&k(!1)}),[y,f,v]);var _=Object(n.useCallback)((function(e){e.preventDefault(),N||T(),setTimeout((function(){return k((function(e){return!e}))}),100)}),[N]);return 0===h.length?null:r.a.createElement("li",{className:Object(p.a)("menu__list-item",{"menu__list-item--collapsed":v}),key:b},r.a.createElement("a",Object(s.a)({className:Object(p.a)("menu__link",(t={"menu__link--sublist":i,"menu__link--active":i&&y},t[E.a.menuLinkText]=!i,t)),onClick:i?_:void 0,href:i?"#!":void 0},d),b),r.a.createElement("ul",{className:"menu__list",ref:j,style:{height:N},onTransitionEnd:function(){v||T(!1)}},h.map((function(e){return r.a.createElement(S,{tabIndex:v?"-1":"0",key:e.label,item:e,onItemClick:l,collapsible:i,activePath:m})}))))}function x(e){var t=e.item,a=e.onItemClick,n=e.activePath,o=(e.collapsible,Object(u.a)(e,["item","onItemClick","activePath","collapsible"])),c=t.href,l=t.label,i=C(t,n);return r.a.createElement("li",{className:"menu__list-item",key:l},r.a.createElement(f.a,Object(s.a)({className:Object(p.a)("menu__link",{"menu__link--active":i}),to:c},Object(g.a)(c)?{isNavLink:!0,exact:!0,onClick:a}:{target:"_blank",rel:"noreferrer noopener"},o),l))}function S(e){switch(e.item.type){case"category":return r.a.createElement(N,e);case"link":default:return r.a.createElement(x,e)}}var T=function(e){var t,a,o=e.path,c=e.sidebar,l=e.sidebarCollapsible,i=void 0===l||l,s=e.onCollapse,u=e.isHidden,f=Object(n.useState)(!1),g=f[0],O=f[1],C=Object(m.useThemeConfig)(),N=C.navbar.hideOnScroll,x=C.hideableSidebar,T=Object(d.a)().isAnnouncementBarClosed,_=Object(y.a)().scrollY;Object(h.a)(g);var P=Object(b.a)();return Object(n.useEffect)((function(){P===b.b.desktop&&O(!1)}),[P]),r.a.createElement("div",{className:Object(p.a)(E.a.sidebar,(t={},t[E.a.sidebarWithHideableNavbar]=N,t[E.a.sidebarHidden]=u,t))},N&&r.a.createElement(v.a,{tabIndex:-1,className:E.a.sidebarLogo}),r.a.createElement("div",{className:Object(p.a)("menu","menu--responsive","thin-scrollbar",E.a.menu,(a={"menu--show":g},a[E.a.menuWithAnnouncementBar]=!T&&0===_,a))},r.a.createElement("button",{"aria-label":g?"Close Menu":"Open Menu","aria-haspopup":"true",className:"button button--secondary button--sm menu__button",type:"button",onClick:function(){O(!g)}},g?r.a.createElement("span",{className:Object(p.a)(E.a.sidebarMenuIcon,E.a.sidebarMenuCloseIcon)},"\xd7"):r.a.createElement(j.a,{className:E.a.sidebarMenuIcon,height:24,width:24})),r.a.createElement("ul",{className:"menu__list"},c.map((function(e){return r.a.createElement(S,{key:e.label,item:e,onItemClick:function(e){e.target.blur(),O(!1)},collapsible:i,activePath:o})})))),x&&r.a.createElement("button",{type:"button",title:"Collapse sidebar","aria-label":"Collapse sidebar",className:Object(p.a)("button button--secondary button--outline",E.a.collapseSidebarButton),onClick:s},r.a.createElement(k,{className:E.a.collapseSidebarButtonIcon})))},_={plain:{backgroundColor:"#2a2734",color:"#9a86fd"},styles:[{types:["comment","prolog","doctype","cdata","punctuation"],style:{color:"#6c6783"}},{types:["namespace"],style:{opacity:.7}},{types:["tag","operator","number"],style:{color:"#e09142"}},{types:["property","function"],style:{color:"#9a86fd"}},{types:["tag-id","selector","atrule-id"],style:{color:"#eeebff"}},{types:["attr-name"],style:{color:"#c4b9fe"}},{types:["boolean","string","entity","url","attr-value","keyword","control","directive","unit","statement","regex","at-rule","placeholder","variable"],style:{color:"#ffcc99"}},{types:["deleted"],style:{textDecorationLine:"line-through"}},{types:["inserted"],style:{textDecorationLine:"underline"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["important","bold"],style:{fontWeight:"bold"}},{types:["important"],style:{color:"#c4b9fe"}}]},P={Prism:a(22).a,theme:_};function I(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function w(){return(w=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}var L=/\r\n|\r|\n/,B=function(e){0===e.length?e.push({types:["plain"],content:"\n",empty:!0}):1===e.length&&""===e[0].content&&(e[0].content="\n",e[0].empty=!0)},D=function(e,t){var a=e.length;return a>0&&e[a-1]===t?e:e.concat(t)},M=function(e,t){var a=e.plain,n=Object.create(null),r=e.styles.reduce((function(e,a){var n=a.languages,r=a.style;return n&&!n.includes(t)||a.types.forEach((function(t){var a=w({},e[t],r);e[t]=a})),e}),n);return r.root=a,r.plain=w({},a,{backgroundColor:null}),r};function A(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&-1===t.indexOf(n)&&(a[n]=e[n]);return a}var R=function(e){function t(){for(var t=this,a=[],n=arguments.length;n--;)a[n]=arguments[n];e.apply(this,a),I(this,"getThemeDict",(function(e){if(void 0!==t.themeDict&&e.theme===t.prevTheme&&e.language===t.prevLanguage)return t.themeDict;t.prevTheme=e.theme,t.prevLanguage=e.language;var a=e.theme?M(e.theme,e.language):void 0;return t.themeDict=a})),I(this,"getLineProps",(function(e){var a=e.key,n=e.className,r=e.style,o=w({},A(e,["key","className","style","line"]),{className:"token-line",style:void 0,key:void 0}),c=t.getThemeDict(t.props);return void 0!==c&&(o.style=c.plain),void 0!==r&&(o.style=void 0!==o.style?w({},o.style,r):r),void 0!==a&&(o.key=a),n&&(o.className+=" "+n),o})),I(this,"getStyleForToken",(function(e){var a=e.types,n=e.empty,r=a.length,o=t.getThemeDict(t.props);if(void 0!==o){if(1===r&&"plain"===a[0])return n?{display:"inline-block"}:void 0;if(1===r&&!n)return o[a[0]];var c=n?{display:"inline-block"}:{},l=a.map((function(e){return o[e]}));return Object.assign.apply(Object,[c].concat(l))}})),I(this,"getTokenProps",(function(e){var a=e.key,n=e.className,r=e.style,o=e.token,c=w({},A(e,["key","className","style","token"]),{className:"token "+o.types.join(" "),children:o.content,style:t.getStyleForToken(o),key:void 0});return void 0!==r&&(c.style=void 0!==c.style?w({},c.style,r):r),void 0!==a&&(c.key=a),n&&(c.className+=" "+n),c})),I(this,"tokenize",(function(e,t,a,n){var r={code:t,grammar:a,language:n,tokens:[]};e.hooks.run("before-tokenize",r);var o=r.tokens=e.tokenize(r.code,r.grammar,r.language);return e.hooks.run("after-tokenize",r),o}))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.render=function(){var e=this.props,t=e.Prism,a=e.language,n=e.code,r=e.children,o=this.getThemeDict(this.props),c=t.languages[a];return r({tokens:function(e){for(var t=[[]],a=[e],n=[0],r=[e.length],o=0,c=0,l=[],i=[l];c>-1;){for(;(o=n[c]++)<r[c];){var s=void 0,u=t[c],p=a[c][o];if("string"==typeof p?(u=c>0?u:["plain"],s=p):(u=D(u,p.type),p.alias&&(u=D(u,p.alias)),s=p.content),"string"==typeof s){var m=s.split(L),d=m.length;l.push({types:u,content:m[0]});for(var h=1;h<d;h++)B(l),i.push(l=[]),l.push({types:u,content:m[h]})}else c++,t.push(u),a.push(s),n.push(0),r.push(s.length)}c--,t.pop(),a.pop(),n.pop(),r.pop()}return B(l),i}(void 0!==c?this.tokenize(t,n,c,a):[n]),className:"prism-code language-"+a,style:void 0!==o?o.root:{},getLineProps:this.getLineProps,getTokenProps:this.getTokenProps})},t}(n.Component),z=a(117),H=a.n(z),W=a(118),$=a.n(W),F={plain:{color:"#bfc7d5",backgroundColor:"#292d3e"},styles:[{types:["comment"],style:{color:"rgb(105, 112, 152)",fontStyle:"italic"}},{types:["string","inserted"],style:{color:"rgb(195, 232, 141)"}},{types:["number"],style:{color:"rgb(247, 140, 108)"}},{types:["builtin","char","constant","function"],style:{color:"rgb(130, 170, 255)"}},{types:["punctuation","selector"],style:{color:"rgb(199, 146, 234)"}},{types:["variable"],style:{color:"rgb(191, 199, 213)"}},{types:["class-name","attr-name"],style:{color:"rgb(255, 203, 107)"}},{types:["tag","deleted"],style:{color:"rgb(255, 85, 114)"}},{types:["operator"],style:{color:"rgb(137, 221, 255)"}},{types:["boolean"],style:{color:"rgb(255, 88, 116)"}},{types:["keyword"],style:{fontStyle:"italic"}},{types:["doctype"],style:{color:"rgb(199, 146, 234)",fontStyle:"italic"}},{types:["namespace"],style:{color:"rgb(178, 204, 214)"}},{types:["url"],style:{color:"rgb(221, 221, 221)"}}]},J=a(85),K=function(){var e=Object(m.useThemeConfig)().prism,t=Object(J.a)().isDarkTheme,a=e.theme||F,n=e.darkTheme||a;return t?n:a},V=a(66),Y=a.n(V),q=/{([\d,-]+)}/,G=function(e){void 0===e&&(e=["js","jsBlock","jsx","python","html"]);var t={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},python:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}},a=["highlight-next-line","highlight-start","highlight-end"].join("|"),n=e.map((function(e){return"(?:"+t[e].start+"\\s*("+a+")\\s*"+t[e].end+")"})).join("|");return new RegExp("^\\s*(?:"+n+")\\s*$")},Q=/(?:title=")(.*)(?:")/,U=function(e){var t=e.children,a=e.className,o=e.metastring,c=Object(m.useThemeConfig)().prism,l=Object(n.useState)(!1),i=l[0],u=l[1],d=Object(n.useState)(!1),h=d[0],b=d[1];Object(n.useEffect)((function(){b(!0)}),[]);var y=Object(n.useRef)(null),f=[],g="",v=K(),k=Array.isArray(t)?t.join(""):t;if(o&&q.test(o)){var j=o.match(q)[1];f=$()(j).filter((function(e){return e>0}))}o&&Q.test(o)&&(g=o.match(Q)[1]);var O=a&&a.replace(/language-/,"");!O&&c.defaultLanguage&&(O=c.defaultLanguage);var E=k.replace(/\n$/,"");if(0===f.length&&void 0!==O){for(var C,N="",x=function(e){switch(e){case"js":case"javascript":case"ts":case"typescript":return G(["js","jsBlock"]);case"jsx":case"tsx":return G(["js","jsBlock","jsx"]);case"html":return G(["js","jsBlock","html"]);case"python":case"py":return G(["python"]);default:return G()}}(O),S=k.replace(/\n$/,"").split("\n"),T=0;T<S.length;){var _=T+1,I=S[T].match(x);if(null!==I){switch(I.slice(1).reduce((function(e,t){return e||t}),void 0)){case"highlight-next-line":N+=_+",";break;case"highlight-start":C=_;break;case"highlight-end":N+=C+"-"+(_-1)+","}S.splice(T,1)}else T+=1}f=$()(N),E=S.join("\n")}var w=function(){H()(E),u(!0),setTimeout((function(){return u(!1)}),2e3)};return r.a.createElement(R,Object(s.a)({},P,{key:String(h),theme:v,code:E,language:O}),(function(e){var t,a=e.className,n=e.style,o=e.tokens,c=e.getLineProps,l=e.getTokenProps;return r.a.createElement(r.a.Fragment,null,g&&r.a.createElement("div",{style:n,className:Y.a.codeBlockTitle},g),r.a.createElement("div",{className:Y.a.codeBlockContent},r.a.createElement("div",{tabIndex:0,className:Object(p.a)(a,Y.a.codeBlock,"thin-scrollbar",(t={},t[Y.a.codeBlockWithTitle]=g,t))},r.a.createElement("div",{className:Y.a.codeBlockLines,style:n},o.map((function(e,t){1===e.length&&""===e[0].content&&(e[0].content="\n");var a=c({line:e,key:t});return f.includes(t+1)&&(a.className=a.className+" docusaurus-highlight-code-line"),r.a.createElement("div",Object(s.a)({key:t},a),e.map((function(e,t){return r.a.createElement("span",Object(s.a)({key:t},l({token:e,key:t})))})))})))),r.a.createElement("button",{ref:y,type:"button","aria-label":"Copy code to clipboard",className:Object(p.a)(Y.a.copyButton),onClick:w},i?"Copied":"Copy")))}))},X=(a(67),a(68)),Z=a.n(X),ee=function(e){return function(t){var a,n=t.id,o=Object(u.a)(t,["id"]),c=Object(m.useThemeConfig)().navbar.hideOnScroll;return n?r.a.createElement(e,o,r.a.createElement("a",{"aria-hidden":"true",tabIndex:-1,className:Object(p.a)("anchor",(a={},a[Z.a.enhancedAnchor]=!c,a)),id:n}),o.children,r.a.createElement("a",{className:"hash-link",href:"#"+n,title:"Direct link to heading"},"#")):r.a.createElement(e,o)}},te=a(69),ae=a.n(te),ne={code:function(e){var t=e.children;return"string"==typeof t?t.includes("\n")?r.a.createElement(U,e):r.a.createElement("code",e):t},a:function(e){return r.a.createElement(f.a,e)},pre:function(e){return r.a.createElement("div",Object(s.a)({className:ae.a.mdxCodeBlock},e))},h1:ee("h1"),h2:ee("h2"),h3:ee("h3"),h4:ee("h4"),h5:ee("h5"),h6:ee("h6")},re=a(99),oe=a(82),ce=a(70),le=a.n(ce);function ie(e){var t,a,l,s,u=e.currentDocRoute,d=e.versionMetadata,h=e.children,b=Object(c.default)(),y=b.siteConfig,f=b.isClient,g=d.pluginId,v=d.permalinkToSidebar,j=d.docsSidebars,O=d.version,E=v[u.path],C=j[E],N=Object(n.useState)(!1),x=N[0],S=N[1],_=Object(n.useState)(!1),P=_[0],I=_[1],w=Object(n.useCallback)((function(){P&&I(!1),S(!x)}),[P]);return r.a.createElement(i.a,{key:f,searchMetadatas:{version:O,tag:Object(m.docVersionSearchTag)(g,O)}},r.a.createElement("div",{className:le.a.docPage},C&&r.a.createElement("div",{className:Object(p.a)(le.a.docSidebarContainer,(t={},t[le.a.docSidebarContainerHidden]=x,t)),onTransitionEnd:function(e){e.currentTarget.classList.contains(le.a.docSidebarContainer)&&x&&I(!0)},role:"complementary"},r.a.createElement(T,{key:E,sidebar:C,path:u.path,sidebarCollapsible:null===(a=null===(l=y.themeConfig)||void 0===l?void 0:l.sidebarCollapsible)||void 0===a||a,onCollapse:w,isHidden:P}),P&&r.a.createElement("div",{className:le.a.collapsedDocSidebar,title:"Expand sidebar","aria-label":"Expand sidebar",tabIndex:0,role:"button",onKeyDown:w,onClick:w},r.a.createElement(k,null))),r.a.createElement("main",{className:le.a.docMainContainer},r.a.createElement("div",{className:Object(p.a)("container padding-vert--lg",le.a.docItemWrapper,(s={},s[le.a.docItemWrapperEnhanced]=x,s))},r.a.createElement(o.a,{components:ne},h)))))}t.default=function(e){var t=e.route.routes,a=e.versionMetadata,n=e.location,o=t.find((function(e){return Object(oe.matchPath)(n.pathname,e)}));return o?r.a.createElement(ie,{currentDocRoute:o,versionMetadata:a},Object(l.a)(t)):r.a.createElement(re.default,e)}}}]);