(()=>{var a={};a.id=231,a.ids=[231],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5511:a=>{"use strict";a.exports=require("crypto")},5552:(a,b,c)=>{"use strict";c.d(b,{$E:()=>m,A5:()=>u,Bv:()=>q,J:()=>n,N8:()=>o,Rv:()=>x,T1:()=>p,cB:()=>v,cx:()=>z,fE:()=>t,iT:()=>w,nq:()=>r,s4:()=>y,vj:()=>s});var d=c(9608),e=c(7360);let f=process.env.DATABASE_URL&&""!==process.env.DATABASE_URL.trim()?(0,d.lw)(process.env.DATABASE_URL):null,g=[{id:1,title:"Sukhna Lake Dawn Migratory Watch",datetime:"2026-03-29T06:00:00.000Z",location:"Sukhna Lake Regulating End, Chandigarh",duration:"3 hours",desc:"Join us as we observe winter migratory waterfowl preparing for departure, alongside resident waders, grebes, and raptors. Binoculars recommended!",upcoming:!0},{id:2,title:"Nepli Forest Trail & Canopy Exploration",datetime:"2026-04-12T06:30:00.000Z",location:"Kansal Forest Gate, Sector 1",duration:"3.5 hours",desc:"Deep walk through Kansal-Nepli reserve forest targeting forest birds, flycatchers, woodpeckers, and the Indian Grey Hornbill.",upcoming:!0}],h=[{id:101,title:"Sukhna Wetland Census",date:"Feb 2026",participants:"24 birder",species:"48",emoji:"\uD83E\uDD86"},{id:102,title:"Morni Foothills Birding",date:"Jan 2026",participants:"18",species:"36",emoji:"\uD83E\uDD85"},{id:103,title:"Rock Garden Urban Avian Walk",date:"Dec 2025",participants:"15",species:"22",emoji:"\uD83C\uDF3F"}],i=[{id:201,name:"Indian Grey Hornbill",latin:"Ocyceros birostris",location:"Sukhna Lake Promenade",photo:"",emoji:"\uD83E\uDEB6",spotter:"Vartika Arora",week:"This week"},{id:202,name:"Indian Roller",latin:"Coracias benghalensis",location:"Lake Club Grounds",photo:"",emoji:"\uD83D\uDC26",spotter:"Priya Sharma",week:"This week"},{id:203,name:"Black-winged Stilt",latin:"Himantopus himantopus",location:"Sukhna Wet Zone",photo:"",emoji:"\uD83E\uDEBF",spotter:"Amanpreet Singh",week:"Last week"},{id:204,name:"White-throated Kingfisher",latin:"Halcyon smyrnensis",location:"Garden of Silence",photo:"",emoji:"\uD83D\uDC1F",spotter:"Rohit Verma",week:"Last week"}],j=[{id:301,name:"Vartika Arora",role:"Founder & Naturalist",year:2023,specialty:"Raptors & Wetlands",av:"av-2"},{id:302,name:"Amanpreet Singh",role:"Club Coordinator",year:2023,specialty:"Passerines & Audio Identification",av:"av-3"},{id:303,name:"Priya Sharma",role:"Photographer",year:2024,specialty:"Avian Photography & Documentation",av:"av-4"},{id:304,name:"Karan Mehra",role:"Member",year:2024,specialty:"Migratory Waterfowl",av:"av-5"}],k=!1;async function l(){if(f&&!k)try{await f`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,await f`
      CREATE TABLE IF NOT EXISTS walks (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        datetime TIMESTAMPTZ NOT NULL,
        location VARCHAR(255) NOT NULL,
        duration VARCHAR(100) DEFAULT 'TBD',
        description TEXT DEFAULT '',
        upcoming BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,await f`
      CREATE TABLE IF NOT EXISTS past_walks (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(100) NOT NULL,
        participants VARCHAR(100) DEFAULT '—',
        species VARCHAR(100) DEFAULT '—',
        emoji VARCHAR(10) DEFAULT '🌿',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,await f`
      CREATE TABLE IF NOT EXISTS birds (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        latin VARCHAR(255) DEFAULT '',
        location VARCHAR(255) NOT NULL,
        photo TEXT DEFAULT '',
        emoji VARCHAR(10) DEFAULT '🐦',
        spotter VARCHAR(100) DEFAULT 'Anonymous',
        week VARCHAR(100) DEFAULT 'This week',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,await f`
      CREATE TABLE IF NOT EXISTS members (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'Member',
        year INT DEFAULT 2024,
        specialty VARCHAR(255) DEFAULT '',
        avatar_class VARCHAR(50) DEFAULT 'av-1',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;let a=await f`SELECT count(*) as count FROM walks`;if(0===parseInt(a[0].count,10))for(let a of g)await f`
          INSERT INTO walks (title, datetime, location, duration, description, upcoming)
          VALUES (${a.title}, ${a.datetime}, ${a.location}, ${a.duration}, ${a.desc}, ${a.upcoming})
        `;let b=await f`SELECT count(*) as count FROM past_walks`;if(0===parseInt(b[0].count,10))for(let a of h)await f`
          INSERT INTO past_walks (title, date, participants, species, emoji)
          VALUES (${a.title}, ${a.date}, ${a.participants}, ${a.species}, ${a.emoji})
        `;let c=await f`SELECT count(*) as count FROM birds`;if(0===parseInt(c[0].count,10))for(let a of i)await f`
          INSERT INTO birds (name, latin, location, photo, emoji, spotter, week)
          VALUES (${a.name}, ${a.latin||""}, ${a.location}, ${a.photo||""}, ${a.emoji}, ${a.spotter}, ${a.week})
        `;let d=await f`SELECT count(*) as count FROM members`;if(0===parseInt(d[0].count,10))for(let a of j)await f`
          INSERT INTO members (name, role, year, specialty, avatar_class)
          VALUES (${a.name}, ${a.role}, ${a.year}, ${a.specialty||""}, ${a.av})
        `;k=!0}catch(a){console.error("Failed to initialize Neon database tables:",a)}}async function m(a,b){let c=a.trim();if(!c||!b)return!1;if(f){await l();let a=await f`
      SELECT password_hash, role, is_active
      FROM users
      WHERE username = ${c}
      LIMIT 1
    `;return 0!==a.length&&"admin"===a[0].role&&!!a[0].is_active&&(0,e.BE)(b,a[0].password_hash)}return!1}async function n(){return f?(await l(),(await f`
      SELECT id, title, datetime, location, duration, description as desc, upcoming, created_at
      FROM walks
      WHERE upcoming = TRUE
      ORDER BY datetime ASC
    `).map(a=>({id:a.id,title:a.title,datetime:new Date(a.datetime).toISOString(),location:a.location,duration:a.duration,desc:a.desc||"",upcoming:a.upcoming,created_at:a.created_at}))):g.filter(a=>a.upcoming)}async function o(a){if(f){await l();let b=(await f`
      INSERT INTO walks (title, datetime, location, duration, description, upcoming)
      VALUES (${a.title}, ${a.datetime}, ${a.location}, ${a.duration||"TBD"}, ${a.desc||""}, TRUE)
      RETURNING id, title, datetime, location, duration, description as desc, upcoming, created_at
    `)[0];return{id:b.id,title:b.title,datetime:new Date(b.datetime).toISOString(),location:b.location,duration:b.duration,desc:b.desc,upcoming:b.upcoming,created_at:b.created_at}}let b={id:Date.now(),title:a.title,datetime:a.datetime,location:a.location,duration:a.duration||"TBD",desc:a.desc||"",upcoming:!0};return g.unshift(b),b}async function p(a){if(f){await l();let b=await f`SELECT * FROM walks WHERE id = ${a}`;if(0===b.length)return!1;let c=b[0];await f`UPDATE walks SET upcoming = FALSE WHERE id = ${a}`;let d=new Date(c.datetime).toLocaleDateString("en-IN",{month:"short",year:"numeric"});return await f`
      INSERT INTO past_walks (title, date, participants, species, emoji)
      VALUES (${c.title}, ${d}, '—', '—', '🌿')
    `,!0}let b=g.findIndex(b=>String(b.id)===String(a));if(-1!==b){let a=g[b];g.splice(b,1);let c=new Date(a.datetime);return h.unshift({id:Date.now(),title:a.title,date:isNaN(c.getTime())?"Recently":c.toLocaleDateString("en-IN",{month:"short",year:"numeric"}),participants:"—",species:"—",emoji:"\uD83C\uDF3F"}),!0}return!1}async function q(a){return f?(await l(),await f`DELETE FROM walks WHERE id = ${a}`):g=g.filter(b=>String(b.id)!==String(a)),!0}async function r(){return f?(await l(),(await f`
      SELECT id, title, date, participants, species, emoji, created_at
      FROM past_walks
      ORDER BY id DESC
    `).map(a=>({id:a.id,title:a.title,date:a.date,participants:a.participants,species:a.species,emoji:a.emoji,created_at:a.created_at}))):h}async function s(a){if(f){await l();let b=(await f`
      INSERT INTO past_walks (title, date, participants, species, emoji)
      VALUES (${a.title}, ${a.date}, ${a.participants||"—"}, ${a.species||"—"}, ${a.emoji||"\uD83C\uDF3F"})
      RETURNING id, title, date, participants, species, emoji, created_at
    `)[0];return{id:b.id,title:b.title,date:b.date,participants:b.participants,species:b.species,emoji:b.emoji,created_at:b.created_at}}let b={id:Date.now(),title:a.title,date:a.date,participants:a.participants||"—",species:a.species||"—",emoji:a.emoji||"\uD83C\uDF3F"};return h.unshift(b),b}async function t(a){return f?(await l(),await f`DELETE FROM past_walks WHERE id = ${a}`):h=h.filter(b=>String(b.id)!==String(a)),!0}async function u(){return f?(await l(),(await f`
      SELECT id, name, latin, location, photo, emoji, spotter, week, created_at
      FROM birds
      ORDER BY id DESC
    `).map(a=>({id:a.id,name:a.name,latin:a.latin||"",location:a.location,photo:a.photo||"",emoji:a.emoji||"\uD83D\uDC26",spotter:a.spotter||"Anonymous",week:a.week||"This week",created_at:a.created_at}))):i}async function v(a){if(f){await l();let b=(await f`
      INSERT INTO birds (name, latin, location, photo, emoji, spotter, week)
      VALUES (${a.name}, ${a.latin||""}, ${a.location}, ${a.photo||""}, ${a.emoji||"\uD83D\uDC26"}, ${a.spotter||"Anonymous"}, ${a.week||"This week"})
      RETURNING id, name, latin, location, photo, emoji, spotter, week, created_at
    `)[0];return{id:b.id,name:b.name,latin:b.latin||"",location:b.location,photo:b.photo||"",emoji:b.emoji,spotter:b.spotter,week:b.week,created_at:b.created_at}}let b={id:Date.now(),name:a.name,latin:a.latin||"",location:a.location,photo:a.photo||"",emoji:a.emoji||"\uD83D\uDC26",spotter:a.spotter||"Anonymous",week:a.week||"This week"};return i.unshift(b),b}async function w(a){return f?(await l(),await f`DELETE FROM birds WHERE id = ${a}`):i=i.filter(b=>String(b.id)!==String(a)),!0}async function x(){return f?(await l(),(await f`
      SELECT id, name, role, year, specialty, avatar_class as av, created_at
      FROM members
      ORDER BY id ASC
    `).map(a=>({id:a.id,name:a.name,role:a.role,year:a.year,specialty:a.specialty||"",av:a.av||"av-1",created_at:a.created_at}))):j}async function y(a){if(f){await l();let b=(await f`
      INSERT INTO members (name, role, year, specialty, avatar_class)
      VALUES (${a.name}, ${a.role||"Member"}, ${a.year||new Date().getFullYear()}, ${a.specialty||""}, ${a.av||"av-1"})
      RETURNING id, name, role, year, specialty, avatar_class as av, created_at
    `)[0];return{id:b.id,name:b.name,role:b.role,year:b.year,specialty:b.specialty||"",av:b.av,created_at:b.created_at}}let b={id:Date.now(),name:a.name,role:a.role||"Member",year:a.year||new Date().getFullYear(),specialty:a.specialty||"",av:a.av||"av-1"};return j.push(b),b}async function z(a){return f?(await l(),await f`DELETE FROM members WHERE id = ${a}`):j=j.filter(b=>String(b.id)!==String(a)),!0}},6177:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>F,patchFetch:()=>E,routeModule:()=>A,serverHooks:()=>D,workAsyncStorage:()=>B,workUnitAsyncStorage:()=>C});var d={};c.r(d),c.d(d,{GET:()=>y,POST:()=>z});var e=c(5736),f=c(9117),g=c(4044),h=c(9326),i=c(2324),j=c(261),k=c(4290),l=c(5328),m=c(8928),n=c(6595),o=c(3421),p=c(7679),q=c(1681),r=c(3446),s=c(6439),t=c(1356),u=c(641),v=c(5552),w=c(7360);let x=["av-1","av-2","av-3","av-4","av-5","av-6","av-7","av-8"];async function y(){try{let a=await (0,v.Rv)();return u.NextResponse.json(a)}catch(a){return console.error("Error fetching members:",a),u.NextResponse.json({error:"Failed to fetch members"},{status:500})}}async function z(a){try{if(!await (0,w.N6)())return u.NextResponse.json({error:"Unauthorized: Admin access required"},{status:401});let{name:b,role:c,year:d,specialty:e}=await a.json();if(!b)return u.NextResponse.json({error:"Member name is required"},{status:400});let f=x[(await (0,v.Rv)()).length%x.length],g=await (0,v.s4)({name:b,role:c||"Member",year:d?parseInt(d,10):new Date().getFullYear(),specialty:e||"",av:f});return u.NextResponse.json(g,{status:201})}catch(a){return console.error("Error adding member:",a),u.NextResponse.json({error:"Failed to add member"},{status:500})}}let A=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/members/route",pathname:"/api/members",filename:"route",bundlePath:"app/api/members/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"D:\\Projects\\chdbirdclub\\src\\app\\api\\members\\route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:B,workUnitAsyncStorage:C,serverHooks:D}=A;function E(){return(0,g.patchFetch)({workAsyncStorage:B,workUnitAsyncStorage:C})}async function F(a,b,c){var d;let e="/api/members/route";"/index"===e&&(e="/");let g=await A.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||A.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===A.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>A.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>A.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await A.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},z),b}},l=await A.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await A.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},6439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},6487:()=>{},7360:(a,b,c)=>{"use strict";c.d(b,{BE:()=>o,Er:()=>n,M9:()=>k,N6:()=>q,aq:()=>i,o7:()=>j,zt:()=>p});var d=c(8318),e=c.n(d),f=c(5511),g=c(6802);let h=process.env.JWT_SECRET,i="cbc_admin_session",j="cbc_csrf_token",k=86400,l="pbkdf2_sha256",m="sha256";function n(a){let b=(0,f.randomBytes)(16).toString("hex"),c=(0,f.pbkdf2Sync)(a,b,1e5,64,m).toString("hex");return`${l}$100000$${b}$${c}`}function o(a,b){let c=b.split("$");if(4!==c.length||c[0]!==l)return!1;let[,d,e,g]=c,h=Number(d);if(!Number.isInteger(h)||h<1||!e||!g)return!1;let i=(0,f.pbkdf2Sync)(a,e,h,64,m),j=Buffer.from(g,"hex");return i.length===j.length&&(0,f.timingSafeEqual)(i,j)}function p(a){if(!h)throw Error("JWT_SECRET is not configured");return e().sign({role:"admin",username:a},h,{expiresIn:k})}async function q(){let a=await (0,g.UL)(),b=a.get(i)?.value;if(!b)return!1;if(!h)return!1;try{let a=e().verify(b,h);return a&&"admin"===a.role}catch{return!1}}},7910:a=>{"use strict";a.exports=require("stream")},8335:()=>{},8354:a=>{"use strict";a.exports=require("util")},9121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},9428:a=>{"use strict";a.exports=require("buffer")}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[543,770,608],()=>b(b.s=6177));module.exports=c})();