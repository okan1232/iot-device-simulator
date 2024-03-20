const mqtt = require('mqtt');
const faker = require('faker');

class IoTDeviceSimulator {
  constructor(brokerUrl, options = {}) {
    this.client = mqtt.connect(brokerUrl);
    this.topic = options.topic || 'iot/simulator';
    this.interval = options.interval || 5000; // Default to 5 seconds
  }

  start() {
    this.client.on('connect', () => {
      console.log(`Connected to broker. Publishing data to ${this.topic} every ${this.interval} ms.`);
      this.publishData();
    });

    this.client.on('error', (error) => {
      console.error('Connection error:', error);
      this.client.end();
    });
  }

  publishData() {
    setInterval(() => {
      const data = {
        temperature: faker.datatype.float({ min: -10, max: 50 }),
        humidity: faker.datatype.float({ min: 0, max: 100 }),
        timestamp: new Date().toISOString(),
      };

      this.client.publish(this.topic, JSON.stringify(data), {}, (error) => {
        if (error) {
          console.error('Publish error:', error);
        }
      });

      console.log('Data published:', data);
    }, this.interval);
  }

  stop() {
    this.client.end();
  }
}

module.exports = IoTDeviceSimulator;