import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "About Verifio";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

// Design system colors
const colors = {
    primaryBase: "#1D9BF1",
    textStrong: "#171717",
    textSub: "#5c5c5c",
    gridLine: "#f0f0f0",
    bgWhite: "#ffffff",
};

// Load Geist Sans font from Google Fonts
async function loadGeistFont() {
    const geist = await fetch(
        new URL(
            "https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RQuQ4nQ.ttf",
        ),
    ).then((res) => res.arrayBuffer());
    return geist;
}

export default async function Image() {
    const geistFont = await loadGeistFont();

    return new ImageResponse(
        <div
            style={{
                background: colors.bgWhite,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Geist",
                position: "relative",
            }}
        >
            {/* Grid pattern background */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
							linear-gradient(${colors.gridLine} 1px, transparent 1px),
							linear-gradient(90deg, ${colors.gridLine} 1px, transparent 1px)
						`,
                    backgroundSize: "60px 60px",
                    display: "flex",
                }}
            />

            {/* Decorative elements - mail envelope shapes */}
            <div
                style={{
                    position: "absolute",
                    top: "80px",
                    right: "100px",
                    display: "flex",
                    gap: "20px",
                }}
            >
                {/* Envelope 1 */}
                <div
                    style={{
                        width: "120px",
                        height: "90px",
                        border: `2px solid ${colors.gridLine}`,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: "rotate(-5deg)",
                    }}
                >
                    <div
                        style={{
                            width: "0",
                            height: "0",
                            borderLeft: "40px solid transparent",
                            borderRight: "40px solid transparent",
                            borderTop: `35px solid ${colors.gridLine}`,
                        }}
                    />
                </div>

                {/* Envelope 2 */}
                <div
                    style={{
                        width: "140px",
                        height: "105px",
                        border: `2px solid ${colors.primaryBase}`,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `${colors.primaryBase}10`,
                    }}
                >
                    <div
                        style={{
                            width: "0",
                            height: "0",
                            borderLeft: "50px solid transparent",
                            borderRight: "50px solid transparent",
                            borderTop: `40px solid ${colors.primaryBase}`,
                        }}
                    />
                </div>
            </div>

            {/* Content - Left side with Text */}
            <div
                style={{
                    position: "absolute",
                    bottom: "80px",
                    left: "80px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    maxWidth: "800px",
                }}
            >
                {/* Eyebrow */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        color: colors.textSub,
                        fontSize: "24px",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    <span>[01] About</span>
                    <span style={{ color: colors.gridLine }}>/</span>
                    <span>Our Story</span>
                </div>

                {/* Title */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                        style={{
                            fontSize: "72px",
                            fontWeight: 700,
                            color: colors.textStrong,
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Building the future of
                    </span>
                    <span
                        style={{
                            fontSize: "72px",
                            fontWeight: 700,
                            color: colors.primaryBase,
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        email verification
                    </span>
                </div>

                {/* Subtitle / Tagline */}
                <div
                    style={{
                        fontSize: "32px",
                        color: colors.textSub,
                        marginTop: "10px",
                        fontWeight: 500,
                    }}
                >
                    Open source. Privacy-first. Built for developers.
                </div>
            </div>

            {/* Brand logo - top left */}
            <div
                style={{
                    position: "absolute",
                    top: "60px",
                    left: "80px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <svg width="350" height="90" viewBox="0 0 99 25" fill="none">
                    <path
                        d="M34.343 19L29.3315 5.35H31.847L35.7665 16.6015L39.7445 5.35H42.221L37.19 19H34.343ZM47.0724 19.234C46.0974 19.234 45.2394 19.026 44.4984 18.61C43.7574 18.181 43.1789 17.583 42.7629 16.816C42.3469 16.049 42.1389 15.165 42.1389 14.164C42.1389 13.124 42.3404 12.214 42.7434 11.434C43.1594 10.654 43.7379 10.043 44.4789 9.601C45.2329 9.159 46.1039 8.938 47.0919 8.938C48.0539 8.938 48.8924 9.1525 49.6074 9.5815C50.3224 10.0105 50.8749 10.589 51.2649 11.317C51.6549 12.032 51.8499 12.838 51.8499 13.735C51.8499 13.865 51.8499 14.008 51.8499 14.164C51.8499 14.32 51.8369 14.4825 51.8109 14.6515H43.8159V13.15H49.4904C49.4644 12.435 49.2239 11.876 48.7689 11.473C48.3139 11.057 47.7484 10.849 47.0724 10.849C46.5914 10.849 46.1494 10.9595 45.7464 11.1805C45.3434 11.4015 45.0249 11.733 44.7909 12.175C44.5569 12.604 44.4399 13.15 44.4399 13.813V14.3785C44.4399 14.9895 44.5504 15.516 44.7714 15.958C45.0054 16.4 45.3174 16.738 45.7074 16.972C46.1104 17.193 46.5589 17.3035 47.0529 17.3035C47.5989 17.3035 48.0474 17.1865 48.3984 16.9525C48.7624 16.7185 49.0289 16.4065 49.1979 16.0165H51.5769C51.3949 16.6275 51.0959 17.18 50.6799 17.674C50.2639 18.155 49.7504 18.5385 49.1394 18.8245C48.5284 19.0975 47.8394 19.234 47.0724 19.234ZM53.8154 19V9.172H55.9019L56.1164 11.005C56.3504 10.576 56.6429 10.212 56.9939 9.913C57.3449 9.601 57.7544 9.3605 58.2224 9.1915C58.7034 9.0225 59.2299 8.938 59.8019 8.938V11.4145H58.9829C58.5929 11.4145 58.2224 11.4665 57.8714 11.5705C57.5204 11.6615 57.2149 11.8175 56.9549 12.0385C56.7079 12.2465 56.5129 12.539 56.3699 12.916C56.2269 13.28 56.1554 13.7415 56.1554 14.3005V19H53.8154ZM61.4684 19V9.172H63.8084V19H61.4684ZM62.6384 7.612C62.2094 7.612 61.8519 7.482 61.5659 7.222C61.2929 6.949 61.1564 6.6175 61.1564 6.2275C61.1564 5.8245 61.2929 5.4995 61.5659 5.2525C61.8519 4.9925 62.2094 4.8625 62.6384 4.8625C63.0674 4.8625 63.4184 4.9925 63.6914 5.2525C63.9774 5.4995 64.1204 5.8245 64.1204 6.2275C64.1204 6.6175 63.9774 6.949 63.6914 7.222C63.4184 7.482 63.0674 7.612 62.6384 7.612ZM66.7855 19V11.1415H65.401V9.172H66.7855V8.0995C66.7855 7.3455 66.9155 6.741 67.1755 6.286C67.4355 5.818 67.806 5.48 68.287 5.272C68.768 5.064 69.34 4.96 70.003 4.96H71.0365V6.949H70.354C69.925 6.949 69.613 7.04 69.418 7.222C69.223 7.391 69.1255 7.69 69.1255 8.119V9.172H75.229V19H72.889V11.1415H69.1255V19H66.7855ZM74.0785 7.69C73.6495 7.69 73.292 7.56 73.006 7.3C72.733 7.027 72.5965 6.6955 72.5965 6.3055C72.5965 5.9025 72.733 5.5775 73.006 5.3305C73.292 5.0705 73.6495 4.9405 74.0785 4.9405C74.5205 4.9405 74.878 5.0705 75.151 5.3305C75.424 5.5775 75.5605 5.9025 75.5605 6.3055C75.5605 6.6955 75.424 7.027 75.151 7.3C74.878 7.56 74.5205 7.69 74.0785 7.69ZM82.3212 19.234C81.3852 19.234 80.5402 19.0195 79.7862 18.5905C79.0452 18.1485 78.4602 17.544 78.0312 16.777C77.6152 15.997 77.4072 15.1065 77.4072 14.1055C77.4072 13.0785 77.6217 12.1815 78.0507 11.4145C78.4797 10.6345 79.0647 10.03 79.8057 9.601C80.5597 9.159 81.4047 8.938 82.3407 8.938C83.2767 8.938 84.1152 9.159 84.8562 9.601C85.6102 10.03 86.1952 10.628 86.6112 11.395C87.0402 12.162 87.2547 13.059 87.2547 14.086C87.2547 15.113 87.0402 16.01 86.6112 16.777C86.1822 17.544 85.5907 18.1485 84.8367 18.5905C84.0957 19.0195 83.2572 19.234 82.3212 19.234ZM82.3212 17.2255C82.7892 17.2255 83.2117 17.1085 83.5887 16.8745C83.9787 16.6405 84.2907 16.2895 84.5247 15.8215C84.7587 15.3535 84.8757 14.775 84.8757 14.086C84.8757 13.397 84.7587 12.825 84.5247 12.37C84.3037 11.902 83.9982 11.551 83.6082 11.317C83.2312 11.083 82.8087 10.966 82.3407 10.966C81.8857 10.966 81.4632 11.083 81.0732 11.317C80.6832 11.551 80.3712 11.902 80.1372 12.37C79.9032 12.825 79.7862 13.397 79.7862 14.086C79.7862 14.775 79.9032 15.3535 80.1372 15.8215C80.3712 16.2895 80.6767 16.6405 81.0537 16.8745C81.4437 17.1085 81.8662 17.2255 82.3212 17.2255Z"
                        fill={colors.primaryBase}
                    />
                </svg>
            </div>
        </div>,
        {
            ...size,
            fonts: [
                {
                    name: "Geist",
                    data: geistFont,
                    style: "normal",
                    weight: 600,
                },
            ],
        },
    );
}
