/**
 * Copyright (c) 2020-present, Goldman Sachs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DownloadIcon } from '@finos/legend-art';
import React from 'react';
import { useEffect } from 'react';
import { renderToString } from 'react-dom/server';

interface DynamicFaviconProps {
  spinning: boolean;
}

export const DynamicFavicon: React.FC<DynamicFaviconProps> = ({ spinning }) => {
  useEffect(() => {
    const favicon: HTMLLinkElement | null =
      document.querySelector("link[rel*='icon']") ||
      document.createElement('link');
    if (favicon) {
      const oldPath = favicon.href;
      if (spinning) {
        const iconElement = React.createElement(DownloadIcon);
        const iconSvgString = props.children.props.children;
        const iconBase64 = `data:image/svg+xml;base64,${btoa(iconSvgString)}`;
        favicon.type = 'image/png';
        favicon.rel = 'shortcut icon';
        favicon.href = `data:image/png;base64,${iconBase64}`;
        document.head.appendChild(favicon);
      } else {
        favicon.type = 'image/x-icon';
        favicon.rel = 'icon';
        favicon.href = oldPath;
        document.head.appendChild(favicon);
      }
    }
  }, [spinning]);

  return null; // The component doesn't render anything in the DOM
};
