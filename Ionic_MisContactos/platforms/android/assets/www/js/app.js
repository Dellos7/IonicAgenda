// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var DEBUG = true;
var NOT_DEBUG = false;
var DEBUG_MODE = NOT_DEBUG;

angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    window.localStorage['contactos'] = null;

    if( !DEBUG_MODE ) {
      loadContacts(); 
    }

  });
})

.controller( "ContactsCtrl", function($scope, $ionicPopup, ContactsFactory) {

  var myScope = $scope;
  var myScope2 = this;
  var ionicPopup = $ionicPopup;

  this.permitirBorrado = false;

  this.filtro = '';

  this.contactos = ( DEBUG_MODE ? ContactsFactory.getContactos() : JSON.parse(window.localStorage['contactos']) ) ;

  this.ordenContactos = "displayName";
  this.ordenAsc = false;

  this.doRefresh = function() {
    if( !DEBUG_MODE ) {
      this.contactos = JSON.parse(window.localStorage['contactos']);
    }
    this.filtro = '';
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$apply();
  };

  this.borrarContacto = function( idContacto ) {

    ionicPopup.confirm( {
      title: 'Borrar contacto',
      template: '¿Estás seguro de que quieres borrar el contacto? Esta operación\
                no puede deshacerse'
    }).then( function(res) {
      if(res) {
        if( !DEBUG_MODE ){
          var options = new ContactFindOptions(); // find the contact to delete
          options.filter = idContacto;
          options.multiple = false;
          var fields = ["id"]; // you can take any.. 
          navigator.contacts.find(fields, deleteContact, onError, options);
        }
        else {
          ContactsFactory.remove( ContactsFactory.get(idContacto) );
        }
      }
    });

    function deleteContact( contacts ) {
        var toRemove = contacts.pop();
        toRemove.remove( onRemoveSuccess, onError );
    }
    
    function onRemoveSuccess( contacts ) {
      var options = new ContactFindOptions();
      options.filter = '';
      options.multiple = true;  // return multiple results
      filter = ["displayName", "phoneNumbers"]; // return contact.displayName field

      // find contacts
      var myContacts = function( callback ) {
        navigator.contacts.find(filter, function(contacts) {
            filterOnlyTelephoneContacts(contacts);
            typeof callback === 'function' && callback();
        }, onError, options);
        typeof callback === 'function' && callback();
      };

      myContacts( function() {
        myScope2.contactos = JSON.parse(window.localStorage['contactos']); 
        myScope.$broadcast('scroll.refreshComplete');
        myScope.$apply();
      });
    }

  };

})

.controller( "NuevoContactoCtrl", function($scope, $ionicPopup, ContactsFactory) {

  var myScope = $scope;
  var myScope2 = this;
  var ionicPopup = $ionicPopup;

  var popupGuardarContacto = function(callback) {
    ionicPopup.alert( {
      title: 'Contacto guardado',
      template: 'Contacto guardado correctamente'
    }).then( function(res) {
      typeof callback === 'function' && callback();
      limpiarFormulario();
    });
  };

  function limpiarFormulario() {
      myScope2.contacto.nombre = "";
      myScope2.contacto.telefono = "";    
  }

  this.contacto = {
    nombre : "",
    telefono: ""
  };

  this.guardarContacto = function () {
    if( this.contacto.nombre && this.contacto.telefono ) {

        var nuevoContacto = {
            nombre: myScope2.contacto.nombre,
            telefono: myScope2.contacto.telefono
        };

        if( DEBUG_MODE ) {
          guardarContacto( nuevoContacto, function() {
            popupGuardarContacto( function() {
                window.location.href = "#/tab/agenda";
            });
          }, ContactsFactory );
        }
        else {
          guardarContacto( nuevoContacto, function(contact) {
            popupGuardarContacto( loadContacts );
          }, null );

        }
    }
  };

})

.factory( "ContactsFactory", function() {
  var contactos = [
    { id: 1,  displayName: "David",        phoneNumbers: [ { value: 669597047 } ] },
    { id: 2,  displayName: "Laura",        phoneNumbers: [ { value: 608123456 } ] },
    { id: 3,  displayName: "Xavi",         phoneNumbers: [ { value: 1234567   } ] },
    { id: 4,  displayName: "Laura Millán", phoneNumbers: [ { value: 987654321 } ] },
    { id: 5,  displayName: "Zira",         phoneNumbers: [ { value: 669597047 } ] },
    { id: 6,  displayName: "Mama",         phoneNumbers: [ { value: 608123456 } ] },
    { id: 7,  displayName: "Papa",         phoneNumbers: [ { value: 1234567   } ] },
    { id: 8,  displayName: "Prueba1",      phoneNumbers: [ { value: 987654321 } ] },
    { id: 9,  displayName: "Tata",         phoneNumbers: [ { value: 669597047 } ] },
    { id: 10, displayName: "Hghas",        phoneNumbers: [ { value: 608123456 } ] },
    { id: 11, displayName: "Xavi",         phoneNumbers: [ { value: 1234567   } ] },
    { id: 12, displayName: "Laura Millán", phoneNumbers: [ { value: 987654321 } ] },
    { id: 13, displayName: "David",        phoneNumbers: [ { value: 669597047 } ] },
    { id: 14, displayName: "Laura",        phoneNumbers: [ { value: 608123456 } ] },
    { id: 15, displayName: "Xavi",         phoneNumbers: [ { value: 1234567   } ] },
    { id: 16, displayName: "Laura Millán", phoneNumbers: [ { value: 987654321 } ] },
    { id: 17, displayName: "David",        phoneNumbers: [ { value: 669597047 } ] }
  ];

    var factoriaContactos = {
      getContactos: function() {
        return contactos;
      },
      remove: function(contacto) {
        contactos.splice(contactos.indexOf(contacto), 1);
      },
      get: function(id) {
        for (var i = 0; i < contactos.length; i++) {
          if (contactos[i].id === parseInt(id)) {
            return contactos[i];
          }
        }
        return null;
      }
    };
    return factoriaContactos;
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'tabs/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.agenda', {
    cache: false,
    url: '/agenda',
    views: {
      'tab-agenda': {
        templateUrl: 'tabs/tab-agenda.html',
        controller: 'ContactsCtrl'
      }
    }
  })

  .state('tab.nuevoContacto', {
      url: '/nuevoContacto',
      views: {
        'tab-nuevoContacto': {
          templateUrl: 'tabs/tab-nuevoContacto.html',
          controller: 'NuevoContactoCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/agenda');

})
;

function loadContacts() {
  var options      = new ContactFindOptions();
  options.filter   = "";
  options.multiple = true;  
  var fields       = ["id", "displayName", "name", "phoneNumbers"];
  navigator.contacts.find(fields, onFindSuccess, onError, options);
}

function onFindSuccess(contacts) {
  filterOnlyTelephoneContacts(contacts);
  window.location.href = "#/tab/agenda";
}

function filterOnlyTelephoneContacts(contacts) {
  var newContacts = [];
  for( var i = 0; i < contacts.length; i++ ) {
    if( contacts[i].phoneNumbers ) {
      var phoneNumber = contacts[i].phoneNumbers[0].value;
      if( typeof phoneNumber == "string" || phoneNumber instanceof String ) {
        newContacts.push(contacts[i]);
      }
    }
  }
  window.localStorage['contactos'] = JSON.stringify(newContacts);
}


function guardarContacto( datosContacto, success, factory ) {
  if( !DEBUG_MODE ) {
    var nuevoContacto = navigator.contacts.create();
    nuevoContacto.displayName = datosContacto.nombre;
    var phoneNumbers = [];
    phoneNumbers[0] = new ContactField('mobile', datosContacto.telefono, true );
    nuevoContacto.phoneNumbers = phoneNumbers;
    nuevoContacto.save( success, onError );
  }
  else {
    var nuevoContacto = { 
            displayName: datosContacto.nombre, 
            phoneNumbers: [ { value: parseInt( datosContacto.telefono ) } ] 
    }; 
    factory.getContactos().push( nuevoContacto );
    success();
  }
}

function onError(error) {
  alert('onError!');
}