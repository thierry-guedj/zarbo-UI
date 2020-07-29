import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps-withscopedautocomp'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC2lLafUa0eRBF_48c4C1lReNBbC3XMVX8',
    libraries: 'places',
  },
})
