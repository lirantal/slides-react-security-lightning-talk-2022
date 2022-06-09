---
theme: purplin
---

# How React Applications Get Hacked in the Real World

--

## Liran Tal

****
<div class="pt-12">
  <span @click="next">
  Security Best Practices in 7 minutes
  <br/>
  Let's get started <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: image-x
image: 'https://github.com/lirantal.png'
imageOrder: 2
---

<style>
img {
  height: 22px;
  width: 50%;
  border-radius: 80%;
}
</style>

# Liran Tal

- 🤓 JavaScript and Node.js developer
- 🥑 Developer Advocate at Snyk.io
- 🔨 Building security education and tools for JavaScript developers

---

# How does React protect you from XSS ?

The basics of Output Encoding

## Safe encoding with HTML Entities

Your code:

```jsx
const firstname = "liran<script>alert(1)</script>tal"
return (
  <span>{firstname}</span>
)
```

---

# How does React protect you from XSS ?

The basics of Output Encoding

## Safe encoding with HTML Entities

Your code:

```jsx {0}
const firstname = "liran<script>alert(1)</script>tal"
return (
  <span>{firstname}</span>
)
```

React outputs:

> liran < script > alert(1) < /script > tal

---

# How does React protect you from XSS ?

The basics of Output Encoding

## Safe encoding with HTML Entities

Your code:

```jsx {0}
const firstname = "liran<script>alert(1)</script>tal"
return (
  <span>{firstname}</span>
)
```

React outputs:

```html
liran &lt; script &gt; alert(1) &lt; /script &gt; tal
```

---

# How does React protect you from XSS ?

The basics of Output Encoding

## Safe encoding with HTML Entities

Your code:

```jsx {0}
const firstname = "liran<script>alert(1)</script>tal"
return (
  <span>{firstname}</span>
)
```

Browser prints:

```html
liran <script> alert(1) </script> tal
```

---
layout: center
---

# React is 'secure by default' 

**means**

# React does output encoding

---
layout: center
---

# React is 'secure by default'

**means**

# React performs output encoding
# **sometimes** 🤷‍♂️

---
layout: center
---

# Discovering XSS vulnerabilities,
#### >> take 1

---
layout: image-right
image: './assets/hack1-xss-0.png'
---

# Links in React apps
<br/>

As a user,

I want to be able to provide my Twitter profile

So that other users can follow me

---
layout: image-right
image: './assets/hack1-xss-0.png'
---

# Links in React apps
User input:

```json
{"twitterLink": "https://twitter.com/katelibby"}
```

<br/>
Your react code:

```jsx {all|5}
<div className="btn-wrapper profile pt-3">
  <Button
    className="btn-icon btn-round"
    color="twitter"
    href={twitterLink}
    id="tooltip639225725"
  >
    <i className="fab fa-twitter" />
  </Button>
  <UncontrolledTooltip delay={0}>
    Follow me
  </UncontrolledTooltip>
</div>
```

---
layout: image-right
image: './assets/hack1-xss-1.png'
---

# Links in React apps

User input:

```json
{"twitterLink": "javascript:alert(1)"}
```

---
layout: image-right
image: './assets/hack1-xss-0.png'
---

# Links in React apps

User input:

```json
{"twitterLink": "javascript:alert(1)"}
```

Attempting a fix (1):

```jsx
if (twitterLink
  .indexOf('javascript:', 0) === 0) {
  setTwitterLink('#');
}
```

---
layout: image-right
image: './assets/hack1-xss-1.png'
---

# Links in React apps

User input:

```json
{"twitterLink": "JAVAscript:alert(1)"}
```

> new user input is uppercase `JAVAscript` vs prior lowercase `javascript`

---
layout: image-right
image: './assets/hack1-xss-0.png'
---

# Links in React apps

User input:

```json
{"twitterLink": "javascript:alert(1)"}
```

Attempting a fix (2):

```jsx {2}
if (twitterLink
  .toLowerCase()
  .indexOf('javascript:', 0) === 0) {
  setTwitterLink('#');
}
```

---
layout: image-right
image: './assets/hack1-xss-1.png'
---

# Links in React apps

User input:

```json
{"twitterLink": "\x19JAVAscript:alert(1)"}
```

> new user input includes control character \x19

---

# Links in React apps

```json
{"twitterLink": "\x19JAVAscript:alert(1)"}
```

<br/>

## Best Practices for handling user input:
<br/>

- React doesn't escape or sanitize user input that flows into the `href` attribute of HTML Anchor elements
- Avoid security controls in the form of denylists
- Always prefix user input with a protocol scheme (e.g. `https://`) and work with relative paths

---
layout: center
---

# Discovering other people's XSS vulnerabilities,
#### >> take 2

---
layout: image-right
image: './assets/hack2-xss-0.png'
---

<style>
div.w-full {
  background-position: right !important;
  background-size: contain !important;
}
</style> 

# Printing a pretty JSON in 3 easy steps

Steps:

- Install: `npm install --save react-json-pretty --ignore-scripts`

- Import: `import JSONPretty from 'react-json-pretty'`

- Use: 
```js
export default function PackageParser(props) {
 return (
    <JSONPretty
      space="4"
      data={props.packageManifest}
    />
 )
}
```

---
layout: image-right
image: './assets/hack2-xss-0.png'
---

<style>
div.w-full {
  background-position: right !important;
  background-size: contain !important;
}
</style> 

# Printing a pretty JSON in 3 easy steps

<br/>
<br/>

**Is it XSS-free?**

> Hint: who says a package manifest needs to be... <br/>
> an object?

---
layout: image-right
image: './assets/hack2-xss-1.png'
---

<style>
div.w-full {
  background-position: right !important;
  background-size: contain !important;
}
</style> 

# Printing a pretty JSON in 3 easy steps

<br/>
<br/>

**Is it XSS-free?**

```json
{
  "packageManifest":
    "<img src=x onError=alert(1) />"
}
```

---
layout: image-right
image: './assets/hack2-xss-1.png'
---

<style>
div.w-full {
  background-position: right !important;
  background-size: contain !important;
}
</style> 

# Printing a pretty JSON in 3 easy steps

```jsx {all|5|14-16}
return (
  <div {...rest} dangerouslySetInnerHTML={
    {__html:
      `<pre class=${themeClassName}${getStyle('main', theme)}>${
        this._pretty.call(this, theme, obj, replacer, +space)
      }</pre>`
    }
  }>
  </div>
);

  private _pretty(theme: ITheme, obj: any, replacer: () => {}, space: number) {
    ...
    return text.replace(/&/g, '&amp;').replace(/\\"([^,])/g, '\\&quot;$1')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(regLine, this._replace.bind(null, theme));
  }
```

---
layout: image-right
image: './assets/hack2-xss-1.png'
---

<style>
div.w-full {
  background-position: right !important;
  background-size: contain !important;
}
</style> 

# Printing a pretty JSON in 3 easy steps

```jsx {all|4|10-14}
if (typeof obj === 'string') {
  try {
    obj = JSON.parse(obj);
  } catch (e) {
    if (!silent) {
      console.warn(`[react-json-pretty]: ${e.message}`);
    }

    return(
      <div {...rest} dangerouslySetInnerHTML={
        {__html:
          `<pre class=${themeClassName}
          ${getStyle('main', theme)}>${obj}</pre>`
        }
      }>
      </div>
    );
  }
}
```

---
layout: image-right
image: './assets/hack2-xss-2.png'
---

<style>
div.w-full {
  background-position: right !important;
  background-size: contain !important;
}
</style> 

# Printing a pretty JSON in 3 easy steps

```js {all|2-6}
const xssmap = {
  '"': '&quot;',
  '\'': '&apos;',
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt',
};

function xss(s) {
  if (!s) {
    return s;
  }

  return s.replace(/<|>|&|"|'/g, (m) => {
    return xssmap[m];
  });
}
```

---
layout: image-right
image: './assets/hack2-xss-3.png'
---

<style>
div.w-full {
  background-position: right !important;
  background-size: contain !important;
}
</style> 

# Escaping XSS in my own components

```jsx {all|1-3|6,9}
function xss(s) {
  ...
}

<Row className="justify-content">
  <div dangerouslySetInnerHTML={
    {__html: `
    <img src=${authorScreenshotURL}
    alt=${xss(authorScreenshotDescription)} />
    `
    }
  } />
</Row>
```

---
layout: image-right
image: './assets/hack2-xss-3.png'
---

<style>
div.w-full {
  background-position: right !important;
  background-size: contain !important;
}
</style> 

# Escaping XSS in my own components

<br/>

User input:

```json
{ "authorScreenshotDescription": 
  "<img src=x onError=alert(1) />" }
```

Your react code:

```jsx {4}
  <div dangerouslySetInnerHTML={
    {__html: `
    <img src=${authorScreenshotURL}
    alt=${xss(authorScreenshotDescription)} />
    `
    }
  } />
```

---
layout: image-right
image: './assets/hack2-xss-4.png'
---

<style>
div.w-full {
  background-position: right !important;
  background-size: contain !important;
}
</style> 

# Escaping XSS in my own components

<br/>

User input:

```json
{ "authorScreenshotDescription":
  "<img src=x onError=alert(1) />" }
```

Your react code:

```jsx {4}
  <div dangerouslySetInnerHTML={
    {__html: `
    <img src=${authorScreenshotURL}
    alt=${xss(authorScreenshotDescription)} />
    `
    }
  } />
```

---

# dangerouslySetInnerHTML pitfalls

```jsx
  alt=${xss(authorScreenshotDescription)} />
```

<br/>

## Best Practices for handling:
<br/>

- Your dependencies might incorrectly use `dangerouslySetInnerHTML`

```java
$ snyk test

Upgrade react-json-pretty@2.0.0 to react-json-pretty@2.0.1 to fix
  ✗ Cross-site Scripting (XSS) [Medium Severity]
    introduced by react-json-pretty@2.0.0

```

---

# dangerouslySetInnerHTML pitfalls

```jsx
  alt=${xss(authorScreenshotDescription)} />
```

<br/>

## Best Practices for handling:

<br/>

- Output encoding is case sensitive
- All of these require different handling
  - Encoding for HTML elements
  - Encoding for HTML attributes
  - Encoding for CSS
  - Encoding for JSON




















