import { api } from '@/lib/api-client';
import { createContext, useContext, useState } from 'react';
import { WidgetConfig, WidgetEntity } from '@reviewsup/api/widgets';
import { PaginateResponse } from '@reviewsup/api/common';
import toast from 'react-hot-toast';

const WidgetContext = createContext<{
  widget: WidgetEntity | undefined;
  setWidget: (widget: WidgetEntity) => void;
  widgets: PaginateResponse<WidgetEntity> | undefined;
  setWidgets: (widgets: PaginateResponse<WidgetEntity>) => void;
  widgetConfig: WidgetConfig | undefined;
  setWidgetConfig: (config: WidgetConfig) => void;
  getWidget: (widgetId: string) => void;
  getWidgets: (productId: string) => void;
  saveChange: () => Promise<void>;
  deleteWidget: (widgetId: string) => Promise<void>;
  createWidget: (productId: string, workspaceName: string) => Promise<void>;
} | null>(null);

export function WidgetProvider(props: { children: React.ReactNode }) {
  const [widgets, setWidgets] = useState<PaginateResponse<WidgetEntity>>();
  const [widget, setWidget] = useState<WidgetEntity>();
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>();

  const getWidget = (widgetId: string) => {
    api.widget
      .getWidget(widgetId)
      .then((response) => {
        setWidget(response);
        setWidgetConfig(response.config as WidgetConfig);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const getWidgets = (productId: string) => {
    api.widget.getWidgets(productId).then((response) => {
      setWidgets(response);
    });
  };

  const deleteWidget = async (widgetId: string) => {
    if (!widgetId) return;
    try {
      await api.widget.deleteWidget(widgetId);
      await getWidgets(widget?.productId || '');
      toast.success('Widget deleted successfully');
    } catch (error) {
      toast.error('Failed to delete widget');
    }
  };

  const createWidget = async (productId: string, workspaceName: string) => {
    if (!productId || !workspaceName) {
      toast.error('Please select a workspace first.');
      return;
    }
    try {
      await api.widget.createWidget({
        productId: productId,
        name: workspaceName,
      });
      await getWidgets(productId);
      toast.success('Widget created successfully');
    } catch (error) {
      toast.error('Failed to create widget');
    }
  };

  const saveChange = async () => {
    if (!widget || !widget.id) return;
    try {
      await api.widget.updateWidget(widget.id, {
        config: widgetConfig,
      });
      toast.success('Form configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update form configuration');
    }
  };

  return (
    <WidgetContext.Provider
      value={{
        widget: widget,
        setWidget: setWidget,
        widgets: widgets,
        setWidgets: setWidgets,

        widgetConfig: widgetConfig,
        setWidgetConfig: setWidgetConfig,

        getWidget: getWidget,
        getWidgets: getWidgets,
        saveChange: saveChange,

        deleteWidget: deleteWidget,
        createWidget: createWidget,
      }}
    >
      {props.children}
    </WidgetContext.Provider>
  );
}

export function useWidgetContext() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
