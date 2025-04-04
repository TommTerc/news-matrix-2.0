/**
 * Sanitizes data for postMessage by handling special data types
 * and converting them to a format that can be safely cloned
 */
export function sanitizeForPostMessage<T>(data: T): any {
  // Handle null or undefined
  if (data === null || data === undefined) {
    return data;
  }

  // Handle primitives
  if (typeof data !== 'object') {
    return data;
  }

  // Handle Date objects
  if (data instanceof Date) {
    return {
      __type: 'Date',
      value: data.toISOString()
    };
  }

  // Handle Map
  if (data instanceof Map) {
    return {
      __type: 'Map',
      value: Array.from(data.entries()).map(([key, value]) => [
        sanitizeForPostMessage(key),
        sanitizeForPostMessage(value)
      ])
    };
  }

  // Handle Set
  if (data instanceof Set) {
    return {
      __type: 'Set',
      value: Array.from(data).map(item => sanitizeForPostMessage(item))
    };
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForPostMessage(item));
  }

  // Handle plain objects
  const sanitized: Record<string, any> = {};
  
  for (const key of Object.keys(data as object)) {
    sanitized[key] = sanitizeForPostMessage((data as any)[key]);
  }

  return sanitized;
}

/**
 * Deserializes data that was sanitized for postMessage back to its original form
 */
export function deserializeFromPostMessage<T>(data: any): T {
  // Handle null or undefined
  if (data === null || data === undefined) {
    return data as T;
  }

  // Handle primitives
  if (typeof data !== 'object') {
    return data as T;
  }

  // Handle special types
  if (data.__type) {
    switch (data.__type) {
      case 'Date':
        return new Date(data.value) as unknown as T;
      case 'Map':
        return new Map(
          data.value.map(([key, value]: [any, any]) => [
            deserializeFromPostMessage(key),
            deserializeFromPostMessage(value)
          ])
        ) as unknown as T;
      case 'Set':
        return new Set(
          data.value.map((item: any) => deserializeFromPostMessage(item))
        ) as unknown as T;
    }
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map(item => deserializeFromPostMessage(item)) as unknown as T;
  }

  // Handle plain objects
  const deserialized: Record<string, any> = {};
  
  for (const key of Object.keys(data)) {
    deserialized[key] = deserializeFromPostMessage(data[key]);
  }

  return deserialized as T;
}

/**
 * Helper function to safely send data via postMessage
 */
export function safePostMessage(target: Window, data: any, targetOrigin: string = '*') {
  const sanitizedData = sanitizeForPostMessage(data);
  target.postMessage(sanitizedData, targetOrigin);
}