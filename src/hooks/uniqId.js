import {uniqueId} from 'lodash';
import {useRef} from 'react';


/**
 * Generates a unique ID.
 *
 * @param {object} [params]
 * @param {string} [params.id] - if provided, this overrides everything and is returned
 * @param {string} [params.prefix] - used to prefix the returned id
 * return {string}
 */
export default function useUniqueId(params) {
  const id = params?.id;
  const prefix = params?.prefix;
  const idRef = useRef(id);
  if (!idRef.current) {
    idRef.current = uniqueId(prefix);
  }
  return idRef.current;
}
