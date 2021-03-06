import org.allenai.plugins.CoreDependencies._

organization := "org.allenai.example"

name := "webapp"

description := "An example web application"

enablePlugins(WebappPlugin)

libraryDependencies ++= Seq(
  allenAiCommon,
  allenAiWebapp,
  sprayJson
)

javaOptions ++= Seq(s"-Dlogback.appname=${name.value}")
