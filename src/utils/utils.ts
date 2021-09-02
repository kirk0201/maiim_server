import { pickBy, isNil, negate } from 'lodash'

export const removeNilFromObject = (object: object) => {
  return pickBy(object, negate(isNil))
}