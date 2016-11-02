# Web Application Template

This template provides a base for developing a web application which includes a ReactJS client-side application and an HTTP web server for serving both static content and an API emitting JSON (or another data format).

## Technologies

* [less](https://trello.com/c/hDMLmLVd/43-less)
* [ReactJS](https://trello.com/c/2YGms6UY/23-reactjs)
* [gulp](https://trello.com/c/RTTfxRe1/37-gulp)
* [nodejs](https://trello.com/c/rpIsl1kf/44-nodejs)
* [spray](https://trello.com/c/5JnPSKPX/1-spray-stack)
* [sbt](https://trello.com/c/N46rdff3/3-sbt-simple-build-tool)

## Dependencies

* [nodejs](https://trello.com/c/rpIsl1kf/44-nodejs)

  ```shell
  brew install node
  ```

* [sbt](https://trello.com/c/N46rdff3/3-sbt-simple-build-tool)

  ```shell
  brew install sbt
  ```

## Getting Started

1. Make sure you've followed the [Getting Started Guide](https://github.com/allenai/wiki/wiki/Getting-Started).

1. Download the [template](https://github.com/allenai/templates/archive/master.zip)

3. Unzip the resulting download and move the contents of `webapp/` to a directory of your choosing.

4. `cd webapp/`

5. Initialize your repository.

  `git init`

6. Add your first commit.

  ```
  git add .
  git commit -m "Initial structure per template."
  ```

7. `sbt`

8. `reStart`

9. Navigate to [http://localhost:8083](http://localhost:8083) to see the front-end.

10. Navigate to [http://localhost:8083/api/hello](http://localhost:8083/api/hello) to see a sample service response.

## Development

* Dynamically recompile as you make changes via: `~compile`.
* Dynamically restart the service as you make changes via `~reStart`.

## Front End Development

Changes to the front-end code will be applied as you make them, even if you only run the `reStart` command without the `~`. If you make changes to the frontend build configuration and need to restart `npm`, you'll have to use `reStop` to stop the background `npm` process, then run `reStart` again to restart it.

There's a slight lag, but keep an eye on your `sbt` console for information regarding the front-end build.

## Questions?

[dev@allenai.org](mailto:dev@allenai.org)

## Using Windows?

Running a Virtualbox with Ubuntu is recommended. Check out [this guide](README_ubuntu_vb_on_windows.md) for details.
