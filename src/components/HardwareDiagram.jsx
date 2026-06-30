// HardwareDiagram — the on-brand node-and-edge SVG from the mockup (lines 508–535).
// Purely geometric: grid pattern, four colored bezier edges, edge-label chips,
// the ESP32 box with pins, and the four peripheral boxes. Static — no data needed.
function HardwareDiagram() {
  return (
    <svg viewBox="0 0 720 430" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <pattern id="amb-grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="var(--line-soft)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="720" height="430" fill="url(#amb-grid)" rx="14" />

      {/* edges */}
      <path d="M210 92 C 280 110, 250 170, 296 190" fill="none" stroke="var(--warm)" strokeWidth="2.5" />
      <path d="M210 360 C 285 345, 255 290, 296 268" fill="none" stroke="var(--amber)" strokeWidth="2.5" />
      <path d="M510 92 C 440 110, 470 170, 424 190" fill="none" stroke="var(--violet)" strokeWidth="2.5" />
      <path d="M510 360 C 440 345, 470 290, 424 268" fill="none" stroke="var(--optimal)" strokeWidth="2.5" />

      {/* edge labels */}
      <g fontFamily="'JetBrains Mono',monospace" fontSize="12" fontWeight="600">
        <rect x="232" y="128" width="62" height="22" rx="6" fill="var(--bg2)" />
        <text x="263" y="143" fill="var(--warm)" textAnchor="middle">GPIO 4</text>
        <rect x="214" y="300" width="98" height="22" rx="6" fill="var(--bg2)" />
        <text x="263" y="315" fill="var(--amber)" textAnchor="middle">SDA21·SCL22</text>
        <rect x="426" y="128" width="68" height="22" rx="6" fill="var(--bg2)" />
        <text x="460" y="143" fill="var(--violet)" textAnchor="middle">GPIO 13</text>
        <rect x="418" y="300" width="86" height="22" rx="6" fill="var(--bg2)" />
        <text x="461" y="315" fill="var(--optimal)" textAnchor="middle">R25 G26 B27</text>
      </g>

      {/* ESP32 */}
      <rect x="296" y="160" width="128" height="118" rx="14" fill="var(--bg2)" stroke="var(--line)" strokeWidth="1.5" />
      <text x="360" y="208" fill="var(--txt)" fontFamily="'Space Grotesk'" fontSize="18" fontWeight="600" textAnchor="middle">ESP32</text>
      <text x="360" y="228" fill="var(--txt3)" fontFamily="'JetBrains Mono',monospace" fontSize="11" textAnchor="middle">upesy_wroom</text>
      <g fill="var(--line)">
        <rect x="288" y="178" width="8" height="6" rx="2" />
        <rect x="288" y="196" width="8" height="6" rx="2" />
        <rect x="288" y="214" width="8" height="6" rx="2" />
        <rect x="424" y="178" width="8" height="6" rx="2" />
        <rect x="424" y="196" width="8" height="6" rx="2" />
        <rect x="424" y="214" width="8" height="6" rx="2" />
      </g>

      {/* peripherals */}
      <g fontFamily="'Space Grotesk'" textAnchor="middle">
        <rect x="60" y="58" width="150" height="58" rx="12" fill="var(--bg2)" stroke="color-mix(in oklch,var(--warm) 30%,var(--line))" strokeWidth="1.5" />
        <circle cx="84" cy="87" r="7" fill="var(--warm)" />
        <text x="128" y="82" fill="var(--txt)" fontSize="15" fontWeight="600">DHT22</text>
        <text x="128" y="101" fill="var(--txt3)" fontSize="11">temp · humidity</text>

        <rect x="60" y="318" width="150" height="58" rx="12" fill="var(--bg2)" stroke="color-mix(in oklch,var(--amber) 30%,var(--line))" strokeWidth="1.5" />
        <circle cx="84" cy="347" r="7" fill="var(--amber)" />
        <text x="130" y="342" fill="var(--txt)" fontSize="15" fontWeight="600">BH1750</text>
        <text x="130" y="361" fill="var(--txt3)" fontSize="11">ambient light</text>

        <rect x="510" y="58" width="150" height="58" rx="12" fill="var(--bg2)" stroke="color-mix(in oklch,var(--violet) 30%,var(--line))" strokeWidth="1.5" />
        <circle cx="534" cy="87" r="7" fill="var(--violet)" />
        <text x="582" y="82" fill="var(--txt)" fontSize="15" fontWeight="600">PIR</text>
        <text x="582" y="101" fill="var(--txt3)" fontSize="11">motion</text>

        <rect x="510" y="318" width="150" height="58" rx="12" fill="var(--bg2)" stroke="color-mix(in oklch,var(--optimal) 30%,var(--line))" strokeWidth="1.5" />
        <circle cx="534" cy="347" r="7" fill="var(--optimal)" />
        <text x="588" y="342" fill="var(--txt)" fontSize="15" fontWeight="600">RGB LED</text>
        <text x="588" y="361" fill="var(--txt3)" fontSize="11">status</text>
      </g>
    </svg>
  );
}

export default HardwareDiagram;
