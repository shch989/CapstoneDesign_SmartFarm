import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DhtService } from './dht.service';
import { Server } from 'socket.io';

@WebSocketGateway(5000, { namespace: 'dht', cors: { origin: '*' } })
export class DhtGateway implements OnGatewayConnection {
  private temperatureArray: number[] = [0, 0, 0, 0, 0];
  private humidityArray: number[] = [0, 0, 0, 0, 0];

  constructor(private readonly dhtService: DhtService) {}

  @WebSocketServer()
  server: Server;

  handleConnection() {
    this.updateData(); // 최초 실행
    setInterval(() => {
      this.updateData(); // 주기적으로 실행
    }, 60000);
  }

  private async updateData() {
    try {
      const temperature = await this.dhtService.getTemperature();
      this.temperatureArray.push(temperature);

      const humidity = await this.dhtService.getHumidity();
      this.humidityArray.push(humidity);

      if (this.temperatureArray.length > 5) {
        this.temperatureArray.shift();
      }

      if (this.humidityArray.length > 5) {
        this.humidityArray.shift();
      }

      this.server.emit('temperatureData', this.temperatureArray);
      console.log("temperature", this.temperatureArray);
      this.server.emit('humidityData', this.humidityArray);
      console.log("humidity", this.humidityArray);
    } catch (err) {
      console.error(err);
    }
  }
}
