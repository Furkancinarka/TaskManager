package com.recurkit.app;

import android.os.Build;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        disableWebViewForceDark();
    }

    private void disableWebViewForceDark() {
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                // API 33+: use setAlgorithmicDarkeningAllowed
                if (Build.VERSION.SDK_INT >= 33) {
                    settings.setAlgorithmicDarkeningAllowed(false);
                }
                // API 29-32: use setForceDark
                else if (Build.VERSION.SDK_INT >= 29) {
                    settings.setForceDark(WebSettings.FORCE_DARK_OFF);
                }
            }
        } catch (Exception e) {
            // Silently ignore — app still works, just with WebView auto-dark
        }
    }
}
