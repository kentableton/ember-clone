/**
@module ember
@submodule ember-runtime
*/

// BEGIN IMPORTS
import Ember from 'ember-metal'; // reexports
import isEqual from 'ember-runtime/is-equal';
import compare from 'ember-runtime/compare';
import copy from 'ember-runtime/copy';
import inject from 'ember-runtime/inject';

import Namespace, {
  isSearchDisabled as isNamespaceSearchDisabled,
  setSearchDisabled as setNamespaceSearchDisabled
} from 'ember-runtime/system/namespace';
import EmberObject from 'ember-runtime/system/object';
import { Container, Registry, getOwner, setOwner } from 'ember-runtime/system/container';
import ArrayProxy from 'ember-runtime/system/array_proxy';
import ObjectProxy from 'ember-runtime/system/object_proxy';
import CoreObject from 'ember-runtime/system/core_object';

import NativeArray from 'ember-runtime/system/native_array';
import EmberStringUtils from 'ember-runtime/system/string';
import {
  onLoad,
  runLoadHooks
} from 'ember-runtime/system/lazy_load';

import EmberArray from 'ember-runtime/mixins/array';
import Comparable from 'ember-runtime/mixins/comparable';
import Copyable from 'ember-runtime/mixins/copyable';
import Enumerable from 'ember-runtime/mixins/enumerable';
import {
  Freezable,
  FROZEN_ERROR
} from 'ember-runtime/mixins/freezable';
import _ProxyMixin from 'ember-runtime/mixins/-proxy';

import Observable from 'ember-runtime/mixins/observable';
import ActionHandler from 'ember-runtime/mixins/action_handler';
import MutableEnumerable from 'ember-runtime/mixins/mutable_enumerable';
import MutableArray from 'ember-runtime/mixins/mutable_array';
import TargetActionSupport from 'ember-runtime/mixins/target_action_support';
import Evented from 'ember-runtime/mixins/evented';
import PromiseProxyMixin from 'ember-runtime/mixins/promise_proxy';

import isEnabled from 'ember-metal/features';

import {
  empty,
  notEmpty,
  none,
  not,
  bool,
  match,
  equal,
  gt,
  gte,
  lt,
  lte,
  oneWay as computedOneWay,
  readOnly,
  defaultTo,
  deprecatingAlias,
  and,
  or,
  any
} from 'ember-runtime/computed/computed_macros';

import {
  sum,
  min,
  max,
  map,
  sort,
  setDiff,
  mapBy,
  filter,
  filterBy,
  uniq,
  uniqBy,
  union,
  intersect,
  collect
} from 'ember-runtime/computed/reduce_computed_macros';

import Controller from 'ember-runtime/controllers/controller';
import ControllerMixin from 'ember-runtime/mixins/controller';

import Service from 'ember-runtime/system/service';

import RSVP from 'ember-runtime/ext/rsvp';     // just for side effect of extending Ember.RSVP
import 'ember-runtime/ext/string';   // just for side effect of extending String.prototype
import 'ember-runtime/ext/function'; // just for side effect of extending Function.prototype

import { isArray, typeOf } from 'ember-runtime/utils';

import RegistryProxyMixin from 'ember-runtime/mixins/registry_proxy';
import ContainerProxyMixin from 'ember-runtime/mixins/container_proxy';

import {
  getStrings,
  setStrings
} from 'ember-runtime/string_registry';

// END IMPORTS

// BEGIN EXPORTS
Ember.compare = compare;
Ember.copy = copy;
Ember.isEqual = isEqual;

Ember.inject = inject;

Ember.Array = EmberArray;

Ember.Comparable = Comparable;
Ember.Copyable = Copyable;

Ember.Freezable = Freezable;
Ember.FROZEN_ERROR = FROZEN_ERROR;

Ember.MutableEnumerable = MutableEnumerable;
Ember.MutableArray = MutableArray;

Ember.TargetActionSupport = TargetActionSupport;
Ember.Evented = Evented;

Ember.PromiseProxyMixin = PromiseProxyMixin;

Ember.Observable = Observable;

Ember.typeOf = typeOf;
Ember.isArray = isArray;

// ES6TODO: this seems a less than ideal way/place to add properties to Ember.computed
var EmComputed = Ember.computed;

EmComputed.empty = empty;
EmComputed.notEmpty = notEmpty;
EmComputed.none = none;
EmComputed.not = not;
EmComputed.bool = bool;
EmComputed.match = match;
EmComputed.equal = equal;
EmComputed.gt = gt;
EmComputed.gte = gte;
EmComputed.lt = lt;
EmComputed.lte = lte;
EmComputed.oneWay = computedOneWay;
EmComputed.reads = computedOneWay;
EmComputed.readOnly = readOnly;
EmComputed.defaultTo = defaultTo;
EmComputed.deprecatingAlias = deprecatingAlias;
EmComputed.and = and;
EmComputed.or = or;
EmComputed.any = any;

EmComputed.sum = sum;
EmComputed.min = min;
EmComputed.max = max;
EmComputed.map = map;
EmComputed.sort = sort;
EmComputed.setDiff = setDiff;
EmComputed.mapBy = mapBy;
EmComputed.filter = filter;
EmComputed.filterBy = filterBy;
EmComputed.uniq = uniq;

if (isEnabled('ember-runtime-computed-uniq-by')) {
  EmComputed.uniqBy = uniqBy;
}

EmComputed.union = union;
EmComputed.intersect = intersect;
EmComputed.collect = collect;

Ember.String = EmberStringUtils;
Ember.Object = EmberObject;
Ember.Container = Container;
Ember.Registry = Registry;

Ember.getOwner = getOwner;
Ember.setOwner = setOwner;

Ember._RegistryProxyMixin = RegistryProxyMixin;
Ember._ContainerProxyMixin = ContainerProxyMixin;

Ember.Namespace = Namespace;
Ember.Enumerable = Enumerable;
Ember.ArrayProxy = ArrayProxy;
Ember.ObjectProxy = ObjectProxy;
Ember.ActionHandler = ActionHandler;
Ember.CoreObject = CoreObject;
Ember.NativeArray = NativeArray;
// ES6TODO: Currently we must rely on the global from ember-metal/core to avoid circular deps
// Ember.A = A;
Ember.onLoad = onLoad;
Ember.runLoadHooks = runLoadHooks;

Ember.Controller = Controller;
Ember.ControllerMixin = ControllerMixin;

Ember.Service = Service;

Ember._ProxyMixin = _ProxyMixin;

Ember.RSVP = RSVP;
// END EXPORTS

/**
  Defines the hash of localized strings for the current language. Used by
  the `Ember.String.loc()` helper. To localize, add string values to this
  hash.

  @property STRINGS
  @for Ember
  @type Object
  @private
*/
Object.defineProperty(Ember, 'STRINGS', {
  configurable: false,
  get: getStrings,
  set: setStrings
});

/**
  Whether searching on the global for new Namespace instances is enabled.

  This is only exported here as to not break any addons.  Given the new
  visit API, you will have issues if you treat this as a indicator of
  booted.

  Internally this is only exposing a flag in Namespace.

  @property BOOTED
  @for Ember
  @type Boolean
  @private
 */
Object.defineProperty(Ember, 'BOOTED', {
  configurable: false,
  enumerable: false,
  get: isNamespaceSearchDisabled,
  set: setNamespaceSearchDisabled
});

export default Ember;
