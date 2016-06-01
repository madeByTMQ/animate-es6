# animate-es6
animate wirted by es6

# start

```javascript
		var wAnimate = new Animate(document.getElementById('testW'));

		wAnimate.add({'width': '600px','height':'600px', 'top': '80px'}, 1000, 'linear', function(){
			console.log('animate done!');
		});

		wAnimate.add({'height': '100px', 'left':'200px', 'opacity': 0}, 2000, 'easeIn');
```
