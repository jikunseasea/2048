export default function ($this, settings) {
  $this.css({
    position: 'relative',
    zIndex: 0,
    backgroundColor: settings.backgroundColor,
    width: `${settings.boxWidth}px`,
    height: `${settings.boxHeight}px`,
    borderRadius: settings.boxRadius,
    padding: `${settings.intervalSize}px`,
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    alignContent: 'space-between'
  });
}