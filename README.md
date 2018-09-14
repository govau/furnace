# :fire: Furnace

> Melts down the [GOLD ( Design System )](https://github.com/govau/designsystem) components into a zip file.
>
> The furnace is an [`express`](https://expressjs.com/) server that allows users to easily get started with the _Australian Government Design System_. The furnace dynamically builds zip files based on each selected component and options that are sent to the server.


## Install

```shell
npm install
npm run build
```
Then run `npm start` or `npm watch` to start the server.


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


# Testing

To test that the furnace is working run `npm run test`. This runs a unit test against the functions making sure the output is correct. It also runs an integration test making sure that a mock zip file is downloaded and has the correct output.

You can also manually test the furnace by sending a POST to the local instance:

```shell
curl -d "components=accordion&components=breadcrumbs&styleOutput=css&jsOutput=js" http://localhost:8080/furnace >> designsystem.zip
```


# Changelog

- v1.0.0 - Initial version of the furnace
