import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Contact Verifio";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

// Design system colors
const colors = {
    primaryBase: "#47c2ff",
    textStrong: "#171717",
    textSub: "#5c5c5c",
    gridLine: "#f0f0f0",
    bgWhite: "#ffffff",
};

// Load Geist Sans font from Google Fonts
async function loadGeistFont() {
    const geist = await fetch(
        new URL(
            "https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RQuQ4nQ.ttf"
        )
    ).then((res) => res.arrayBuffer());
    return geist;
}

export default async function Image() {
    const geistFont = await loadGeistFont();

    return new ImageResponse(
        (
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

                    {/* Envelope 3 */}
                    <div
                        style={{
                            width: "120px",
                            height: "90px",
                            border: `2px solid ${colors.gridLine}`,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: "rotate(5deg)",
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
                </div>

                {/* Content - Left side */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "80px",
                        left: "80px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0px",
                    }}
                >
                    {/* Title */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                            style={{
                                fontSize: "120px",
                                fontWeight: 700,
                                color: colors.primaryBase,
                            }}
                        >
                            Contact
                        </span>
                    </div>
                </div>

                {/* Illustration - Right side (envelope shapes) */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "100px",
                        right: "100px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                    }}
                >
                    {/* Row 1 */}
                    <div style={{ display: "flex", gap: "20px" }}>
                        {/* Large envelope - filled */}
                        <div
                            style={{
                                width: "100px",
                                height: "75px",
                                background: colors.primaryBase,
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                paddingTop: "8px",
                            }}
                        >
                            <div
                                style={{
                                    width: "0",
                                    height: "0",
                                    borderLeft: "35px solid transparent",
                                    borderRight: "35px solid transparent",
                                    borderTop: "30px solid white",
                                }}
                            />
                        </div>

                        {/* Small envelope - outline */}
                        <div
                            style={{
                                width: "80px",
                                height: "60px",
                                border: `2px solid ${colors.gridLine}`,
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                paddingTop: "6px",
                            }}
                        >
                            <div
                                style={{
                                    width: "0",
                                    height: "0",
                                    borderLeft: "28px solid transparent",
                                    borderRight: "28px solid transparent",
                                    borderTop: `24px solid ${colors.gridLine}`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div style={{ display: "flex", gap: "20px", marginLeft: "40px" }}>
                        {/* Small envelope - outline */}
                        <div
                            style={{
                                width: "70px",
                                height: "52px",
                                border: `2px solid ${colors.gridLine}`,
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                paddingTop: "5px",
                            }}
                        >
                            <div
                                style={{
                                    width: "0",
                                    height: "0",
                                    borderLeft: "24px solid transparent",
                                    borderRight: "24px solid transparent",
                                    borderTop: `20px solid ${colors.gridLine}`,
                                }}
                            />
                        </div>

                        {/* Medium envelope - light fill */}
                        <div
                            style={{
                                width: "90px",
                                height: "67px",
                                background: `${colors.primaryBase}15`,
                                border: `2px solid ${colors.primaryBase}`,
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                paddingTop: "7px",
                            }}
                        >
                            <div
                                style={{
                                    width: "0",
                                    height: "0",
                                    borderLeft: "30px solid transparent",
                                    borderRight: "30px solid transparent",
                                    borderTop: `25px solid ${colors.primaryBase}`,
                                }}
                            />
                        </div>
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
                    <svg
                        width="350"
                        height="90"
                        viewBox="0 0 99 25"
                        fill="none"
                    >
                        <path
                            d="M34.343 19L29.3315 5.35H31.847L35.7665 16.6015L39.7445 5.35H42.221L37.19 19H34.343ZM47.0724 19.234C46.0974 19.234 45.2394 19.026 44.4984 18.61C43.7574 18.181 43.1789 17.583 42.7629 16.816C42.3469 16.049 42.1389 15.165 42.1389 14.164C42.1389 13.124 42.3404 12.214 42.7434 11.434C43.1594 10.654 43.7379 10.043 44.4789 9.601C45.2329 9.159 46.1039 8.938 47.0919 8.938C48.0539 8.938 48.8924 9.1525 49.6074 9.5815C50.3224 10.0105 50.8749 10.589 51.2649 11.317C51.6549 12.032 51.8499 12.838 51.8499 13.735C51.8499 13.865 51.8499 14.008 51.8499 14.164C51.8499 14.32 51.8369 14.4825 51.8109 14.6515H43.8159V13.15H49.4904C49.4644 12.435 49.2239 11.876 48.7689 11.473C48.3139 11.057 47.7484 10.849 47.0724 10.849C46.5914 10.849 46.1494 10.9595 45.7464 11.1805C45.3434 11.4015 45.0249 11.733 44.7909 12.175C44.5569 12.604 44.4399 13.15 44.4399 13.813V14.3785C44.4399 14.9895 44.5504 15.516 44.7714 15.958C45.0054 16.4 45.3174 16.738 45.7074 16.972C46.1104 17.193 46.5589 17.3035 47.0529 17.3035C47.5989 17.3035 48.0474 17.1865 48.3984 16.9525C48.7624 16.7185 49.0289 16.4065 49.1979 16.0165H51.5769C51.3949 16.6275 51.0959 17.18 50.6799 17.674C50.2639 18.155 49.7504 18.5385 49.1394 18.8245C48.5284 19.0975 47.8394 19.234 47.0724 19.234ZM53.8154 19V9.172H55.9019L56.1164 11.005C56.3504 10.576 56.6429 10.212 56.9939 9.913C57.3449 9.601 57.7544 9.3605 58.2224 9.1915C58.7034 9.0225 59.2299 8.938 59.8019 8.938V11.4145H58.9829C58.5929 11.4145 58.2224 11.4665 57.8714 11.5705C57.5204 11.6615 57.2149 11.8175 56.9549 12.0385C56.7079 12.2465 56.5129 12.539 56.3699 12.916C56.2269 13.28 56.1554 13.7415 56.1554 14.3005V19H53.8154ZM61.4684 19V9.172H63.8084V19H61.4684ZM62.6384 7.612C62.2094 7.612 61.8519 7.482 61.5659 7.222C61.2929 6.949 61.1564 6.6175 61.1564 6.2275C61.1564 5.8245 61.2929 5.4995 61.5659 5.2525C61.8519 4.9925 62.2094 4.8625 62.6384 4.8625C63.0674 4.8625 63.4184 4.9925 63.6914 5.2525C63.9774 5.4995 64.1204 5.8245 64.1204 6.2275C64.1204 6.6175 63.9774 6.949 63.6914 7.222C63.4184 7.482 63.0674 7.612 62.6384 7.612ZM66.7855 19V11.1415H65.401V9.172H66.7855V8.0995C66.7855 7.3455 66.9155 6.741 67.1755 6.286C67.4355 5.818 67.806 5.48 68.287 5.272C68.768 5.064 69.34 4.96 70.003 4.96H71.0365V6.949H70.354C69.925 6.949 69.613 7.04 69.418 7.222C69.223 7.391 69.1255 7.69 69.1255 8.119V9.172H75.229V19H72.889V11.1415H69.1255V19H66.7855ZM74.0785 7.69C73.6495 7.69 73.292 7.56 73.006 7.3C72.733 7.027 72.5965 6.6955 72.5965 6.3055C72.5965 5.9025 72.733 5.5775 73.006 5.3305C73.292 5.0705 73.6495 4.9405 74.0785 4.9405C74.5205 4.9405 74.878 5.0705 75.151 5.3305C75.424 5.5775 75.5605 5.9025 75.5605 6.3055C75.5605 6.6955 75.424 7.027 75.151 7.3C74.878 7.56 74.5205 7.69 74.0785 7.69ZM82.3212 19.234C81.3852 19.234 80.5402 19.0195 79.7862 18.5905C79.0452 18.1485 78.4602 17.544 78.0312 16.777C77.6152 15.997 77.4072 15.1065 77.4072 14.1055C77.4072 13.0785 77.6217 12.1815 78.0507 11.4145C78.4797 10.6345 79.0647 10.03 79.8057 9.601C80.5597 9.159 81.4047 8.938 82.3407 8.938C83.2767 8.938 84.1152 9.159 84.8562 9.601C85.6102 10.03 86.1952 10.628 86.6112 11.395C87.0402 12.162 87.2547 13.059 87.2547 14.086C87.2547 15.113 87.0402 16.01 86.6112 16.777C86.1822 17.544 85.5907 18.1485 84.8367 18.5905C84.0957 19.0195 83.2572 19.234 82.3212 19.234ZM82.3212 17.2255C82.7892 17.2255 83.2117 17.1085 83.5887 16.8745C83.9787 16.6405 84.2907 16.2895 84.5247 15.8215C84.7587 15.3535 84.8757 14.775 84.8757 14.086C84.8757 13.397 84.7587 12.825 84.5247 12.37C84.3037 11.902 83.9982 11.551 83.6082 11.317C83.2312 11.083 82.8087 10.966 82.3407 10.966C81.8857 10.966 81.4632 11.083 81.0732 11.317C80.6832 11.551 80.3712 11.902 80.1372 12.37C79.9032 12.825 79.7862 13.397 79.7862 14.086C79.7862 14.775 79.9032 15.3535 80.1372 15.8215C80.3712 16.2895 80.6767 16.6405 81.0537 16.8745C81.4437 17.1085 81.8662 17.2255 82.3212 17.2255Z"
                            fill={colors.textStrong}
                        />
                        <path
                            d="M11.4405 0.726892C11.8057 0.620576 12.1935 0.62053 12.5587 0.726893C12.9731 0.847626 13.343 1.16463 14.0821 1.79818L14.878 2.47982C15.2105 2.76479 15.377 2.90757 15.5645 3.00912C15.731 3.09921 15.9098 3.16547 16.0948 3.20541C16.3034 3.25043 16.5228 3.25033 16.961 3.25033L17.5499 3.25033C18.6695 3.25033 19.2296 3.25029 19.6573 3.4681C20.0335 3.65978 20.3396 3.96598 20.5313 4.34213C20.7493 4.76995 20.7491 5.33042 20.7491 6.45053L20.7491 7.03939C20.7491 7.47755 20.749 7.69703 20.794 7.90561C20.8339 8.09043 20.9003 8.26859 20.9903 8.4349C21.0918 8.62251 21.2346 8.78896 21.5196 9.12143L22.2022 9.9183C22.8355 10.6571 23.1527 11.0265 23.2735 11.4408C23.3799 11.8061 23.3799 12.1946 23.2735 12.5599C23.1528 12.9744 22.8358 13.3442 22.2022 14.0833L21.5196 14.8792C21.2345 15.2118 21.0919 15.3781 20.9903 15.5658C20.9002 15.7322 20.834 15.911 20.794 16.096C20.7491 16.3045 20.7491 16.5236 20.7491 16.9613L20.7491 17.5501C20.7491 18.6702 20.7493 19.2307 20.5313 19.6585C20.3396 20.0348 20.0336 20.3408 19.6573 20.5326C19.2295 20.7505 18.6696 20.7503 17.5499 20.7503L16.961 20.7503C16.5229 20.7503 16.3034 20.7502 16.0948 20.7953C15.9098 20.8352 15.731 20.9015 15.5645 20.9915C15.377 21.0931 15.2106 21.2358 14.878 21.5208L14.0821 22.2035C13.343 22.837 12.9731 23.154 12.5587 23.2747C12.1936 23.381 11.8056 23.381 11.4405 23.2747C11.0261 23.154 10.6561 22.8369 9.91706 22.2035L9.12117 21.5208C8.78846 21.2357 8.62134 21.0931 8.43367 20.9915C8.26733 20.9016 8.08922 20.8352 7.90437 20.7953C7.69578 20.7502 7.47636 20.7503 7.03816 20.7503L6.41511 20.7503C5.2954 20.7503 4.73545 20.7504 4.30769 20.5326C3.93143 20.3408 3.62542 20.0348 3.43367 19.6585C3.21568 19.2307 3.21492 18.6702 3.21492 17.5501L3.21492 16.9486C3.21492 16.5144 3.21527 16.2971 3.17097 16.0902C3.13166 15.9066 3.0663 15.7293 2.97761 15.5638C2.87764 15.3774 2.73771 15.2114 2.45711 14.8802L1.76961 14.0697C1.14712 13.335 0.835799 12.9671 0.716871 12.556C0.612144 12.1934 0.612144 11.8082 0.716871 11.4456C0.835685 11.0343 1.14685 10.6669 1.76961 9.93197L2.45711 9.12045C2.73773 8.78927 2.87765 8.62332 2.97761 8.43685C3.06633 8.27136 3.13167 8.09409 3.17097 7.91048C3.21523 7.70358 3.21492 7.48636 3.21492 7.05209L3.21492 6.45052C3.21492 5.33042 3.21568 4.76995 3.43367 4.34213C3.62543 3.96604 3.93154 3.65976 4.30769 3.4681C4.73544 3.25038 5.29554 3.25033 6.41511 3.25033L7.03816 3.25033C7.47636 3.25033 7.69578 3.25043 7.90437 3.20541C8.08926 3.16548 8.26731 3.09913 8.43367 3.00912C8.62134 2.90756 8.78846 2.765 9.12117 2.47982L9.91707 1.79818C10.6562 1.16463 11.026 0.847626 11.4405 0.726892ZM16.5303 8.47006C16.2375 8.17716 15.7627 8.17716 15.4698 8.47006L11.0001 12.9398L9.53035 11.4701C9.23745 11.1772 8.76269 11.1772 8.4698 11.4701C8.17713 11.763 8.17698 12.2378 8.4698 12.5306L10.4698 14.5306C10.6104 14.6712 10.8013 14.7503 11.0001 14.7503C11.1989 14.7503 11.3897 14.6711 11.5303 14.5306L16.5303 9.5306C16.8232 9.23775 16.8231 8.76296 16.5303 8.47006Z"
                            fill={colors.primaryBase}
                        />
                    </svg>
                </div>
            </div>
        ),
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
