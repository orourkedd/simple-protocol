const isSuccess = p => !!p && p.success === true
const isFailure = p => !!p && p.success === false
const getSuccesses = l => l.filter(isSuccess)
const getFailures = l => l.filter(isFailure)
const assign = require('lodash/assign')
const some = require('lodash/some')
const find = require('lodash/find')

const isProtocol = s => {
  if (!s) return false
  if (hasSuccess(s) && (hasPayload(s) || hasError(s))) return true
  return false
}

const normalize = (fn, p) => (isProtocol(p) ? p : fn(p))
const normalizeToSuccess = p => normalize(success, p)
const normalizeToFailure = p => normalize(failure, p)
const normalizeListToSuccess = l => l.map(normalizeToSuccess)
const normalizeListToFailure = l => l.map(normalizeToFailure)

const errorToObject = e => {
  const props = Object.getOwnPropertyNames(e).concat('name')
  return props.reduce((p, c) => {
    p[c] = e[c]
    return p
  }, {})
}

const success = (payload = null, props = {}) => {
  if (isSuccess(payload)) return assign(payload, props)
  return assign(
    {
      success: true,
      payload
    },
    props
  )
}

const failure = (e = null, props = {}) => {
  if (isFailure(e)) return assign(e, props)
  let error = e
  if (typeof e === 'string') {
    error = { message: e }
  } else if (e instanceof Error) {
    error = errorToObject(e)
  }

  return assign(
    {
      success: false,
      error
    },
    props
  )
}

const hasError = s => s.hasOwnProperty('error')
const hasPayload = s => s.hasOwnProperty('payload')
const hasSuccess = s => s.hasOwnProperty('success')

const clean = s => {
  if (hasPayload(s)) {
    return {
      success: s.success,
      payload: s.payload
    }
  } else if (hasError(s)) {
    return {
      success: s.success,
      error: s.error
    }
  }
}

const hasAnyFailures = l => {
  return some(l, isFailure)
}

const getFirstFailure = l => {
  return find(l, isFailure)
}

module.exports = {
  getSuccesses,
  getFailures,
  normalizeToSuccess,
  normalizeToFailure,
  normalizeListToSuccess,
  normalizeListToFailure,
  isSuccess,
  isFailure,
  success,
  failure,
  isProtocol,
  errorToObject,
  clean,
  hasAnyFailures,
  getFirstFailure
}
