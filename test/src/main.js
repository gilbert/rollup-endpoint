import { foo, bar, baz } from './lib/helpers'

console.log("Got:", foo(bar))

console.log("baz", baz)

document.getElementById('app').innerHTML = `It works! ${baz(5)}`
