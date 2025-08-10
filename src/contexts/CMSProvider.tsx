import React, { ReactNode } from 'react';
import { HotelProvider } from './HotelContext';
import { RestaurantProvider } from './RestaurantContext';
import { TransportProvider } from './TransportContext';
import { TranslatorProvider } from './TranslatorContext';
import { GuideProvider } from './GuideContext';
import { ActivityProvider } from './ActivityContext';
import { GiftProvider } from './GiftContext';
import { ClientProvider } from './ClientContext';
import { DayTemplateProvider } from './DayTemplateContext';

interface CMSProviderProps {
  children: ReactNode;
}

export function CMSProvider({ children }: CMSProviderProps) {
  return (
    <HotelProvider>
      <RestaurantProvider>
        <TransportProvider>
          <TranslatorProvider>
            <GuideProvider>
              <ActivityProvider>
                <GiftProvider>
                  <ClientProvider>
                    <DayTemplateProvider>
                      {children}
                    </DayTemplateProvider>
                  </ClientProvider>
                </GiftProvider>
              </ActivityProvider>
            </GuideProvider>
          </TranslatorProvider>
        </TransportProvider>
      </RestaurantProvider>
    </HotelProvider>
  );
}
