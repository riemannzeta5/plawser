# Plawser: Browser-Based Point-and-Click Game Framework

Plawser is a framework that allows you to build point-and-click games for the browser. It applies for example to text RPGs (including a game I'm currently developing) and probably also to many other kinds of games.

To use Plawser, first install Browserify. Then, run Browserify on Plawser:

`browserify Main.js -o plawser.js`

Include the produced script in your HTML file, and you're ready to go!

To see what Plawser can do, check out the source code, where all exposed methods are documented. You call a constructor, method, etc., by prefixing it with `plawser`, e.g. you'd call `new plawser.GameObject(...)`.

I will keep developing and adding to this project alongside my game. Once that is more-or-less finished, I plan to release the source code for it, which then you can use as a more complete example of how Plawser can be used.

## Contributing

I'd love suggestions and contributions to Plawser. Keep in mind that right now, I'm developing this alongside my game, thus I'm expecting this project to be in a state of flux and will most likely not accept PRs. In the future, once my game is released, if you want to contribute or even help maintain the project, reach out to me and we'll see if that can work!
