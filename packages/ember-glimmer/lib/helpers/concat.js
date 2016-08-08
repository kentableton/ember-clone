import { helper } from '../helper';
import { normalizeTextValue } from 'glimmer-runtime';

/**
@module ember
@submodule ember-templates
*/

/**
  Concatenates the given arguments into a string.

  Example:

  ```handlebars
  {{some-component name=(concat firstName " " lastName)}}

  {{! would pass name="<first name value> <last name value>" to the component}}
  ```

  @public
  @method concat
  @for Ember.Templates.helpers
  @since 1.13.0
*/
function concat(args) {
  return args.map(normalizeTextValue).join('');
}

export default helper(concat);
