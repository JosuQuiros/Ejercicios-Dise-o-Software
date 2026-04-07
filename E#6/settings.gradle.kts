pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}

rootProject.name = "boat-tours-monorepo"

include("tour-service", "guide-service")
