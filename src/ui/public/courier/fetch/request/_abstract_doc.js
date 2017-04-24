import { AbstractRequestProvider } from './request';

export function AbstractDocRequestProvider(Private) {

  const AbstractRequest = Private(AbstractRequestProvider);

  class AbstractDocRequest extends AbstractRequest {
    constructor(...args) {
      super(...args);

      this.type = 'doc';
    }

    canStart() {
      const parent = super.canStart();
      if (!parent) return false;

      if (!this.source.get('id')) return false;

      const version = this.source._version;
      const storedVersion = this.source._getStoredVersion();

      // conditions that equal "fetch This DOC!"
      const unknown = !version && !storedVersion;
      const mismatch = version !== storedVersion;

      return Boolean(mismatch || (unknown && !this.started));
    }

    handleResponse(resp) {
      if (resp.found) {
        this.source._storeVersion(resp._version);
      } else {
        this.source._clearVersion();
      }

      return super.handleResponse(resp);
    }
  }

  return AbstractDocRequest;
}
