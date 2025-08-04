import express from 'express';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

const app = express();
app.use(express.json());

const influx = new InfluxDB({ url: 'http://localhost:8086', token: 'wuhaa-token' });
const writeApi = influx.getWriteApi('wuhaa_org', 'weather');
writeApi.useDefaultTags({ source: 'wuhaa' });

app.post('/data/:station', (req, res) => {
  const station = req.params.station;
  const { temperature, humidity, timestamp } = req.body;

  const point = new Point('weather')
    .tag('station', station)
    .floatField('temperature', temperature)
    .floatField('humidity', humidity)
    .timestamp(new Date(timestamp));

  writeApi.writePoint(point);
  writeApi.flush();
  res.send('OK');
});

app.listen(3000, () => console.log('WUHAa listening on port 3000'));
