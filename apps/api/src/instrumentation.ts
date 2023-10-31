import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import * as process from 'process';
import { Logger } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const metricReader = new PrometheusExporter({
  port: 8081,
});

const traceExporter = new OTLPTraceExporter({
  url: process.env.OLTP_TRACE_EXPORTER,
});

const spanProcessor = new BatchSpanProcessor(traceExporter);

const otelSDK = new NodeSDK({
  metricReader,
  spanProcessor: spanProcessor,
  contextManager: new AsyncLocalStorageContextManager(),
  instrumentations: [getNodeAutoInstrumentations()],
  textMapPropagator: new CompositePropagator({
    propagators: [
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
});

export default otelSDK;

if (typeof process === 'object' && typeof process.on === 'function') {
  process.on('SIGTERM', () => {
    otelSDK
      .shutdown()
      .then(
        () => Logger.log('SDK shut down successfully'),
        (err) => Logger.log('Error shutting down SDK', err)
      )
      .finally(() => process.exit(0));
  });
} else {
  Logger.error('Process.on is not available.');
}
