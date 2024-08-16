class YandexWebWrapper {

    constructor(readyCallback) {
        // Advertisement fields.
        this.bannerVisible = false;
        this.interstitialVisible = false;
        this.rewardedVisible = false;
        // Advertisement elements.
        this.bannerElement = null;
        // Wrapper initialization.
        console.log("Wrapper initialization started.");
        try {
            // Hide banner advertisement by default.
            this.bannerElement = document.querySelector("#banner-container");
            this.bannerElement.style.display = "none";
            aspectRatio.setRightOffset(0);
            aspectRatio.setBottomOffset(0);
            // Main initialization.
            window.yaContextCb = window.yaContextCb || [];
            let script = document.createElement("script");
            script.src = "https://yandex.ru/ads/system/context.js";
            script.onload = () => {
                console.log("Wrapper initialization completed.");
                readyCallback();
                // Display banner advertisement by default.
                this.invokeBanner();
            };
            document.body.appendChild(script);
        }
        catch (exception) {
            console.error("Wrapper initialization failed.", exception);
            readyCallback();
        }
    }

    // Banner advertisement methods.

    isBannerVisible() {
        return this.bannerVisible;
    }

    invokeBanner() {
        console.log("Invoke banner called.");
        return new Promise((resolve, reject) => {
            try {
                this.bannerElement.style.display = "flex";
                // Display banner advertisement.
                window.yaContextCb.push(() => {
                    Ya.Context.AdvManager.render({
                        "blockId": runtimeData.yandexBannerId,
                        "statId": runtimeData.yandexGameId,
                        "renderTo": "banner-container"
                    });
                    this.bannerVisible = true;
                    aspectRatio.setRightOffset(300);
                    aspectRatio.setBottomOffset(200);
                    aspectRatio.update();
                    resolve();
                });
            }
            catch (exception) {
                console.error("Invoke banner failed.", exception);
                this.bannerElement.style.display = "none";
                this.bannerVisible = false;
                aspectRatio.setRightOffset(0);
                aspectRatio.setBottomOffset(0);
                aspectRatio.update();
                reject(exception);
            }
        });
    }

    disableBanner() {
        console.log("Disable banner called.");
        return new Promise((resolve, reject) => {
            try {
                this.bannerElement.style.display = "none";
                this.bannerVisible = false;
                aspectRatio.setRightOffset(0);
                aspectRatio.setBottomOffset(0);
                aspectRatio.update();
                resolve();
            }
            catch (exception) {
                console.error("Disable banner failed.", exception);
                reject(exception);
            }
        });
    }

    // Interstitial advertisement methods.

    isInterstitialVisible() {
        return this.interstitialVisible;
    }

    invokeInterstitial() {
        console.log("Invoke interstitial called.");
        return new Promise((resolve, reject) => {
            try {
                window.yaContextCb.push(() => {
                    if (Ya.Context.AdvManager.getPlatform() === 'desktop') {
                        // Display interstitial advertisement for desktop.
                        Ya.Context.AdvManager.render({
                            "blockId": runtimeData.yandexInterstitialDesktopId,
                            "statId": runtimeData.yandexGameId,
                            "type": "fullscreen",
                            "platform": "desktop",
                            onRender: (data) => {
                                console.log("Interstitial advertisement rendered.", data);
                                application.publishEvent("OnInterstitialEvent", "Begin");
                                this.interstitialVisible = true;
                            },
                            onClose: (data) => {
                                console.log("Interstitial advertisement closed.", data);
                                application.publishEvent("OnInterstitialEvent", "Close");
                                this.interstitialVisible = false;
                            },
                            onError: (type) => {
                                console.error("Interstitial advertisement error.", type);
                                application.publishEvent("OnInterstitialEvent", "Error");
                                this.interstitialVisible = false;
                            }
                        });
                    } else {
                        // Display interstitial advertisement for mobile.
                        Ya.Context.AdvManager.render({
                            "blockId": runtimeData.yandexInterstitialMobileId,
                            "statId": runtimeData.yandexGameId,
                            "type": "fullscreen",
                            "platform": "touch",
                            onRender: (data) => {
                                console.log("Interstitial advertisement rendered.", data);
                                application.publishEvent("OnInterstitialEvent", "Begin");
                                this.interstitialVisible = true;
                            },
                            onClose: (data) => {
                                console.log("Interstitial advertisement closed.", data);
                                application.publishEvent("OnInterstitialEvent", "Close");
                                this.interstitialVisible = false;
                            },
                            onError: (type) => {
                                console.error("Interstitial advertisement error.", type);
                                application.publishEvent("OnInterstitialEvent", "Error");
                                this.interstitialVisible = false;
                            }
                        });
                    }
                    resolve();
                });
            }
            catch (exception) {
                console.error("Invoke interstitial failed.", exception);
                application.publishEvent("OnInterstitialEvent", "Error");
                this.interstitialVisible = false;
                reject(exception);
            }
        });
    }

    // Rewarded advertisement methods.

    isRewardedVisible() {
        return this.rewardedVisible;
    }

    invokeRewarded() {
        console.log("Invoke rewarded called.");
        return new Promise((resolve, reject) => {
            try {
                window.yaContextCb.push(() => {
                    if (Ya.Context.AdvManager.getPlatform() === 'desktop') {
                        // Display rewarded advertisement for desktop.
                        window.yaContextCb.push(() => {
                            Ya.Context.AdvManager.render({
                                "blockId": runtimeData.yandexRewardedDesktopId,
                                "statId": runtimeData.yandexGameId,
                                "type": "rewarded",
                                "platform": "desktop",
                                onRender: (data) => {
                                    console.log("Rewarded advertisement rendered.", data);
                                    application.publishEvent("OnRewardedEvent", "Begin");
                                    this.rewardedVisible = true;
                                },
                                onClose: (data) => {
                                    console.log("Rewarded advertisement closed.", data);
                                    application.publishEvent("OnRewardedEvent", "Close");
                                    this.rewardedVisible = false;
                                },
                                onRewarded: (isRewarded) => {
                                    if (isRewarded == true) {
                                        console.log("Rewarded advertisement success.");
                                        application.publishEvent("OnRewardedEvent", "Success");
                                    }
                                },
                                onError: (type) => {
                                    console.error("Rewarded advertisement error.", type);
                                    application.publishEvent("OnRewardedEvent", "Error");
                                    this.rewardedVisible = false;
                                }
                            });
                        });
                    }
                    else {
                        // Display rewarded advertisement for mobile.
                        window.yaContextCb.push(() => {
                            Ya.Context.AdvManager.render({
                                "blockId": runtimeData.yandexRewardedMobileId,
                                "statId": runtimeData.yandexGameId,
                                "type": "rewarded",
                                "platform": "touch",
                                onRender: (data) => {
                                    console.log("Rewarded advertisement rendered.", data);
                                    application.publishEvent("OnRewardedEvent", "Begin");
                                    this.rewardedVisible = true;
                                },
                                onClose: (data) => {
                                    console.log("Rewarded advertisement closed.", data);
                                    application.publishEvent("OnRewardedEvent", "Close");
                                    this.rewardedVisible = false;
                                },
                                onRewarded: (isRewarded) => {
                                    if (isRewarded == true) {
                                        console.log("Rewarded advertisement success.");
                                        application.publishEvent("OnRewardedEvent", "Success");
                                    }
                                },
                                onError: (type) => {
                                    console.error("Rewarded advertisement error.", type);
                                    application.publishEvent("OnRewardedEvent", "Error");
                                    this.rewardedVisible = false;
                                }
                            });
                        });
                    }
                });
                resolve();
            }
            catch (exception) {
                console.error("Invoke rewarded failed.", exception);
                application.publishEvent("OnRewardedEvent", "Error");
                reject(exception);
            }
        });
    }

}

export function initialize(readyCallback) {
    if (typeof window !== 'undefined') {
        window.yandexWebWrapper = new YandexWebWrapper(readyCallback);
    }
}