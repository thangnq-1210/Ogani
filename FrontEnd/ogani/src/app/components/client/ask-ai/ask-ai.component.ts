import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AskAiService } from 'src/app/_service/ask-ai.service';
@Component({
  selector: 'app-ask-ai',
  templateUrl: './ask-ai.component.html',
  styleUrls: ['./ask-ai.component.css']
})
export class AskAiComponent {
  question: string = '';
  result: any;
  showInput: boolean = false;
  isLoading: boolean = false;
  messages: { from: string, text: string }[] = [];

  constructor(
    private askAiService: AskAiService
  ) {}

  askAI() {
    if (!this.question.trim()) return;
  
    this.messages.push({ from: 'user', text: this.question });
    this.isLoading = true;
  
    const userQuestion = this.question;
    this.question = ''; 
  
    setTimeout(() => {
      this.askAiService.askAI(userQuestion).subscribe(
        (res) => {
          this.isLoading = false;
          this.messages.push({
            from: 'bot',
            text: res.response || 'Không có kết quả từ AI.'
          });
          this.question = '';
        },
        (err) => {
          this.isLoading = false;
          this.messages.push({
            from: 'bot',
            text: 'Có lỗi khi kết nối tới AI.'
          });
        }
      );
    }, 2000); 
  }

  toggleInput() {
    this.showInput = !this.showInput;
    if (this.showInput && this.messages.length === 0) {
      this.messages.push({
        from: 'bot',
        text: 'Xin chào, tôi là chatbot của nhóm 21, tôi có thể giúp gì cho bạn?'
      });
    }
  }
}
