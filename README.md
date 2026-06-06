# H5PEditor.MapPointSelector

A custom H5P editor widget that allows content creators to pick a geographical location (latitude and longitude) using an interactive Leaflet map. It features a text-based search (geocoding) input to quickly find locations anywhere in the world.

This widget is designed to be embedded within other H5P content types (such as [H5P Interactive Map](https://github.com/Matheu46/h5p-interactive-map)) to facilitate selecting coordinates.

---

## 🚀 Key Features

* **Interactive Leaflet Map**: Simply click anywhere on the map to set a marker and instantly capture its precise latitude and longitude.
* **Geocoding & Location Search**: Built-in address search bar powered by OpenStreetMap's Nominatim API. Authors can search for cities, states, addresses, or landmarks to center the map.
* **"Focus on Point" Shortcut**: A contextual helper button that automatically flies the map back to the currently selected marker location.

---

## 📦 Dependencies

This editor widget relies on the Leaflet library for rendering and managing the interactive map. It assumes the Leaflet library is loaded via the `H5P.Leaflet` dependency wrapper:

* **H5P Dependency**: `H5P.Leaflet` (major version `1`, minor version `9` or higher)

---

## 🛠️ Developer Integration

### 1. Registering Dependency in `library.json`

To use `H5PEditor.MapPointSelector` in your own H5P content type editor, declare it as a preloaded dependency in your `library.json` file:

```json
{
  "title": "Your Interactive Map Content Type",
  "machineName": "H5P.YourInteractiveMap",
  "majorVersion": 1,
  "minorVersion": 0,
  "patchVersion": 0,
  "runnable": 1,
  "preloadedDependencies": [
    {
      "machineName": "H5P.Leaflet",
      "majorVersion": 1,
      "minorVersion": 9
    },
    {
      "machineName": "H5PEditor.MapPointSelector",
      "majorVersion": 1,
      "minorVersion": 0
    }
  ]
}
```

### 2. Using the Widget in `semantics.json`

Bind the widget to a `group` field in your `semantics.json`. The group **must** contain two sub-fields named exactly `latitude` and `longitude` of type `number`:

```json
{
  "name": "location",
  "type": "group",
  "label": "Point Coordinates",
  "widget": "mapPointSelector",
  "fields": [
    {
      "name": "latitude",
      "type": "number",
      "label": "Latitude",
      "decimals": 6
    },
    {
      "name": "longitude",
      "type": "number",
      "label": "Longitude",
      "decimals": 6
    }
  ]
}
```

---

## 🎨 Default Configuration

By default, if no coordinates are pre-selected:
* **Initial Map Center**: Brazil (`latitude: -5.82473`, `longitude: -35.1868`)
* **Initial Zoom Level**: `14`

---

## 📄 License

This library is open-source and licensed under the [MIT License](LICENSE).
