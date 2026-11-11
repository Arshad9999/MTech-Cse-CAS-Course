// Adapted from MicroKit's GradientUnderlineButton by henriquegpb; MIT licence in third-party/MICROKIT-LICENSE.txt.
export function GradientUnderlineLink({ href, children }) {
  return <a className="microkit-link" href={href}>
    <span className="microkit-link-label">{children}</span>
    <span className="microkit-link-line" aria-hidden="true" />
  </a>;
}
