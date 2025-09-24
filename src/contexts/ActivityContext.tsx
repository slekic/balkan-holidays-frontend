import React, { act, createContext, useContext, useEffect, useState } from 'react';
import { Activity } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, getCurrentTimestamp } from './base';
import { createUsluga, deleteUslugaApi, getAllUsluge, updateUslugaApi, uploadImages } from '../api/cms';
import { mapUslugaToActivity, mapActivityToRequest } from '../utils/cms_response_mappers';
import { dataURLtoFile, extractRelativePath } from '../utils/image_converter';

interface ActivityContextType extends BaseEntityContext<Activity> {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateActivity: (id: string, updates: Partial<Activity & { backgroundImage?: string; images?: string[] }>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: BaseProviderProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllUsluge("aktivnost");
        console.log(data)
        setActivities(data.items.map(mapUslugaToActivity));
      } catch (err) {
        console.error("Failed to load activities:", err);
      }
    })();
  }, []);

  const addActivity = async (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createUsluga("aktivnost", mapActivityToRequest(activity));
      const mapped = mapUslugaToActivity(created);
      const data: File[] = [];
      const img_types: string[] = [];

      if (activity.backgroundImage && activity.backgroundImage != '') {
              data.push(dataURLtoFile(activity.backgroundImage, "activity-logo"+mapped.id));
              img_types.push("logo"); 
      }
      if (activity.images && activity.images.length > 0) {
          for (let i = 0; i < activity.images.length; i++) {
            const img = activity.images[i];
            data.push(dataURLtoFile(img, `activity-image-${mapped.id}-${i}`));
            img_types.push("slika");  
          }
      }

      if (data.length > 0){
          const res = await uploadImages(
            Number(mapped.id),
            "usluga",
            data,
            img_types,
            []
          );
          
          mapped.backgroundImage = res.slike
              .filter((s: { tip: string }) => s.tip === "logo")
              .map((s: { putanja: string }) => s.putanja)[0] ?? mapped.backgroundImage;

          if (Array.isArray(res.slike)) {
            mapped.images = res.slike
              .filter((s: { tip: string }) => s.tip === "slika")
              .map((s: { putanja: string }) => s.putanja) || mapped.images;
          }
          
      }
      setActivities(prev => [...prev, { ...mapped, createdAt: getCurrentTimestamp(), updatedAt: getCurrentTimestamp() }]);
    } catch (err) {
      console.error("Failed to add activity:", err);
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity & { backgroundImage?: string; images?: string[] }>) => {
    try {
      const updated = await updateUslugaApi(Number(id), {
        naziv: updates.name,
        komentar: updates.defaultComment,
        opis: updates.description,
        pdv_grupa: updates.vatGroup,
        slike: [],
      });
      const mapped = mapUslugaToActivity(updated);
      const activity = activities.find(a => a.id === id);
      
      if (!activity) throw new Error("Activity not found");

      const data: File[] = [];
      const img_types: string[] = [];
      const pathsToRemove: string[] = [];

      let logoChanged = false;
      mapped.backgroundImage = activity.backgroundImage;

      if (updates.backgroundImage !== activity.backgroundImage) {
          // logo is different → upload new image
          pathsToRemove.push(
            ...[activity.backgroundImage ? extractRelativePath(activity.backgroundImage) : undefined]
              .filter((p): p is string => !!p)
          );
      
          if (updates.backgroundImage !== undefined && updates.backgroundImage !== "") {
              data.push(dataURLtoFile(updates.backgroundImage, `activity-logo${id}`));
              img_types.push("logo");
          }else{
            mapped.backgroundImage = undefined
          }

          logoChanged = true;
      }
      if (updates.images || activity.images.length > 0) {    
        const diff = (!updates.images || updates.images.length === 0)
                      ? activity.images
                      : activity.images.filter(existing => !updates.images?.includes(existing));
        const keep = (!updates.images || updates.images.length === 0)
                      ? []
                      : activity.images.filter(existing => updates.images?.includes(existing));
        pathsToRemove.push(...diff.map(img => extractRelativePath(img)));
      
        const toRemove = (logoChanged) ? pathsToRemove.length - 1 : pathsToRemove.length
        if (toRemove == 0 && activity.images.length == updates.images?.length) {
            mapped.images = activity.images
        } else {
            const newImages = updates.images?.filter(img => !activity.images.includes(img)) || [];
            if (newImages.length > 0) {
              for (let i = 0; i < newImages.length; i++) {
                  const img = newImages[i];
                        
                  data.push(dataURLtoFile(img, `activity-image-${id}-${i}`));
                  img_types.push("slika");
              }
            }
            mapped.images = keep
            console.log("Uploading images:", data, img_types, pathsToRemove);  
        }
      } 
      if(data.length || pathsToRemove){
          const res = await uploadImages(
                    Number(id),
                    "usluga",
                    data,
                    img_types,
                    pathsToRemove
          );

          console.log("RES " + res.slike)
          console.log("TR " + mapped.images)
          console.log("BG " + mapped.backgroundImage)
          mapped.backgroundImage = res.slike
              .filter((s: { tip: string }) => s.tip === "logo")
              .map((s: { putanja: string }) => s.putanja)[0] ?? mapped.backgroundImage;

          if (Array.isArray(res.slike)) {
            mapped.images = mapped.images.concat(res.slike
              .filter((s: { tip: string }) => s.tip === "slika")
              .map((s: { putanja: string }) => s.putanja)) || mapped.images;
          }
      }
      setActivities(prev =>
        prev.map(a => a.id === id ? { ...mapped, updatedAt: getCurrentTimestamp() } : a)
      );
    } catch (err) {
      console.error("Failed to update activity:", err);
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      await deleteUslugaApi(Number(id));
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Failed to delete activity:", err);
    }
  };

  return (
    <ActivityContext.Provider value={{
      activities,
      items: activities,
      addActivity,
      addItem: addActivity,
      updateActivity,
      updateItem: updateActivity,
      deleteActivity,
      deleteItem: deleteActivity
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}
