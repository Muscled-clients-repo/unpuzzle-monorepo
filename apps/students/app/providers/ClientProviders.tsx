"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "../redux/store";
import { VideoTimeProvider } from "../context/VideoTimeContext";
import { NavigationLoadingProvider } from "../context/NavigationLoadingContext";
import { AuthProvider } from "@unpuzzle/auth";
import { ToastContainer } from 'react-toastify';
import { TestLoadingButton } from "../components/TestLoadingButton";
import { NavigationWrapper } from "../components/navigation/NavigationWrapper";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainer />
      <Provider store={store}>
        <AuthProvider>
          <NavigationLoadingProvider>
            <NavigationWrapper>
              <VideoTimeProvider>
                {children}
                <TestLoadingButton />
              </VideoTimeProvider>
            </NavigationWrapper>
          </NavigationLoadingProvider>
        </AuthProvider>
      </Provider>
    </>
  );
}