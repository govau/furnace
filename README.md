# :fire: Furnace

> Melts down the [GOLD ( Design System )](https://github.com/govau/designsystem) components into a zip file.
>
> The furnace is an [`express`](https://expressjs.com/) server that allows users to easily get started with the _Australian Government Design System_. The furnace dynamically builds zip files based on each selected component and options that are sent to the server.


## Install

```shell
npm install
```
Then run `npm run build && npm start` or `npm watch` to start the server.


## Getting started
Once the server is started it can now take `POST` requests at the URL [`http://localhost:8080/furnace/`](http://localhost:8080/furnace/). The `POST` requests are in the form of:

```
{
	components: [ 'accordion', 'breadcrumbs' ],
	styleOutput: 'css',
	jsOutput: 'js',
}
```

The above `POST` would return a zip file containing minified `css` and `js` for all of the dependencies of `accordion` and `breadcrumbs`.

### `components` 
An `array` of components that relates to the currently live components in the [uikit](https://github.com/govau/uikit/tree/master/packages).

### `styleOutput`
- __`css`__: css minified
- __`cssModules`__: css modules for each component
- __`sassModules`__: sass modules for each component

### `jsOutput`
- __`js`__: js minified
- __`jsModules`__: js modules for each component
- __`react`__: react modules for each component
