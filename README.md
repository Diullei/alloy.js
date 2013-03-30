alloy.js
========

A javascript library to dynamic binding.

> UNDER CONSTRUCTION

# Getting started

## One-way data binding

The goal of this feature is allow you to inject data in your html using {{expression}}. 

Example:

```html
<html>
	<body data-al-init>
		<script src="https://github.com/Diullei/alloy.js/raw/master/alloy-0.1.0.min.js"></script>

		<div>Hello {{dataValue}}!</div>

		<script type="text/javascript">
			var dataValue;
			var today = new Date();
			dataValue = 'world ${today.getFullYear()}-${today.getMonth()}-${today.getDay()}';
		</script>
	</body>
</html>
```

[See on jsfiddler](http://jsfiddle.net/UXJV4/)

The template expression above is a one-way data binding. It sets up automatic monitoring of the data, and ensures that the html stays up-to-date when the data’s value changes.

Another example:

```html
<html>
	<body data-al-init>
		<script src="https://github.com/Diullei/alloy.js/raw/master/alloy-0.1.0.min.js"></script>

		<div>Hello counter: {{count}}</div>

		<script type="text/javascript">
			count = 0;
			window.setInterval(function(){
				count++;
			}, 1000);
		</script>
	</body>
</html>
```

[See on jsfiddler](http://jsfiddle.net/7frX4/)

## Two-way data binding

Two-way data binding lets us define that we want a DOM element’s value (typically an input box or a check box) to be kept in sync with the value of an object. 
Example:

```html
<html>
	<body data-al-init>
		<script src="https://github.com/Diullei/alloy.js/raw/master/alloy-0.1.0.min.js"></script>

		<div>
			Input:
			<input type="text" data-al-bind="str" placeholder="type something here">
			<div> Value: {{str}}</div>
		</div>

		<script type="text/javascript">
			str = '';
		</script>
	</body>
</html>
```

[See on jsfiddler](http://jsfiddle.net/xYRkz/)

## Under construction

This library is under construction yet. I hope to release a stable version soon.