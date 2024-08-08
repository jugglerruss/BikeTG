class VkontakteWrapper {

	constructor(readyCallback) {
		// Advertisement fields.
		this.bannerVisible = false;
		this.interstitialVisible = false;
		this.rewardedVisible = false;
		// Payments fields.
		this.cacheProductsData = "";
		this.cachePaymentsData = "";
		// Prefs fields.
		this.jsonContainers = [
			"json-data"
		];
		this.cacheContainers = {};
		// Wrapper initialization.
		console.log("Wrapper initialization started.");
		try {
			let script = document.createElement("script");
			script.src = "https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js";
			script.onload = () => {
				vkBridge.send('VKWebAppInit').then(() => {
					console.log("SDK initialized successfully.");
					readyCallback();
				});
				vkBridge.subscribe((event) => {
					console.log('VK Bridge event', event);
				});
				// Send initial request to check ads availability.
				vkBridge.send('VKWebAppCheckNativeAds', { ad_format: 'interstitial' });
				vkBridge.send('VKWebAppCheckNativeAds', { ad_format: 'reward' });
			};
			document.body.appendChild(script);
		}
		catch (exception) {
			// Initiate application loading anyway.
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

	}

	disableBanner() {
		console.log("Disable banner called.");

	}

	refreshBannerStatus() {
		console.log("Refresh banner status called.");

	}

	// Interstitial advertisement methods.

	isInterstitialVisible() {
		return this.interstitialVisible;
	}

	invokeInterstitial() {
		console.log("Invoke interstitial called.");
		return new Promise((resolve, reject) => {
			// Mark interstitial as visible.
			console.log("Interstitial event: onOpen.");
			this.interstitialVisible = true;
			application.publishEvent("OnInterstitialEvent", "Begin");
			// Invoke VK interstitial.
			vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' }).then((data) => {
				if (data.result) {
					console.log("Interstitial event: onClose.");
					this.interstitialVisible = false;
					application.publishEvent("OnInterstitialEvent", "Close");
					resolve(data);
				} else {
					console.error("Interstitial event: onError.");
					this.interstitialVisible = false;
					application.publishEvent("OnInterstitialEvent", "Error");
					reject(new Error("Interstitial ad failed to show."));
				}
				// Send request to check interstitial availability again.
				vkBridge.send('VKWebAppCheckNativeAds', { ad_format: 'interstitial' });
			}).catch((exception) => {
				console.error("Invoke interstitial failed.", exception);
				this.interstitialVisible = false;
				application.publishEvent("OnInterstitialEvent", "Error");
				reject(exception);
				// Send request to check interstitial availability again.
				vkBridge.send('VKWebAppCheckNativeAds', { ad_format: 'interstitial' });
			});
		});
	}

	// Rewarded advertisement methods.

	isRewardedVisible() {
		return this.rewardedVisible;
	}

	invokeRewarded() {
		console.log("Invoke rewarded called.");
		return new Promise((resolve, reject) => {
			// Mark rewarded as visible.
			console.log("Rewarded event: onOpen.");
			this.rewardedVisible = true;
			application.publishEvent("OnRewardedEvent", "Begin");
			// Invoke VK rewarded.
			vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' }).then((data) => {
				if (data.result) {
					console.log("Rewarded watched successfully.");
					this.rewardedVisible = false;
					application.publishEvent("OnRewardedEvent", "Close");
					application.publishEvent("OnRewardedEvent", "Success");
					resolve(data);
				}
				else {
					console.error("Rewarded event: onError.", error);
					this.rewardedVisible = false;
					application.publishEvent("OnRewardedEvent", "Error");
				}
			}).catch((exception) => {
				console.error("Invoke rewarded failed.", exception);
				this.rewardedVisible = false;
				application.publishEvent("OnRewardedEvent", "Error");
				reject(exception);
			});
		});
	}

	// Payments methods.

	resolvePayments() {
		console.log("Payments resolving started.");

	}

	invokePurchase(productTag) {
		console.log("Invoke purchase called.");

	}

	resolveServerProducts() {
		console.log("Server products caching started.");

	}

	resolveServerPurchases() {
		console.log("Server purchases caching started.");

	}

	resolveCacheProducts() {
		return this.cacheProductsData;
	}

	resolveCachePurchases() {
		return this.cachePurchasesData;
	}

	// Saves methods.

	resolveSaves() {
		console.log("Saves resolving started.");

	}

	writeSaves() {
		console.log("Write saves called.");

	}

	resolveCacheSaves(containerTag) {
		console.log("Resolve cache saves called.");
		let containerJSON = this.cacheContainers[containerTag];
		if (containerJSON == null) {
			return "Empty";
		}
		return containerJSON;
	}

	writeCacheSaves(containerTag, json) {
		console.log("Write cache saves called.");
		try {
			this.cacheContainers[containerTag] = json;
			console.log("Cache saves written successfully.");
		}
		catch (exception) {
			console.error("Cache saves write failed.", exception);
		}
	}

	// Language methods.

	resolveLanguage() {
		console.log("Resolve language called.");
		try {
			return "ru";
		}
		catch (exception) {
			console.error("Resolve language failed.", exception);
			return "en";
		}
	}

}

export function initialize(readyCallback) {
	if (typeof window !== 'undefined') {
		window.vkontakteWrapper = new VkontakteWrapper(readyCallback);
	}
}