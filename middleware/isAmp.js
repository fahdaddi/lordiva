export default function (context) {
  if (context.query.amp !== undefined) {
    context.isAmp = true
  } else {
    context.isAmp = false
  }
}
