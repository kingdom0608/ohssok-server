export enum EStudentErrorMessage {
  STUDENT_NOT_FOUND = '존재하지 않는 학생 입니다.',
}
export enum EStudentManagementCardErrorMessage {
  STUDENT_MANAGEMENT_CARD_NOT_FOUND = '존재하지 않는 학생 관리 카드 입니다.',
  STUDENT_MANAGEMENT_CARD_INVALID_LECTURE_INPUT = '강의 아이디와 제목을 모두 입력해 주세요.',
}

export enum EStudentManagementCardDetailErrorMessage {
  STUDENT_MANAGEMENT_CARD_DETAIL_NOT_FOUND = '존재하지 않는 학생 관리 카드 상세 입니다.',
  STUDENT_MANAGEMENT_CARD_DETAIL_INVALID_SEND_MESSAGE = '메세지를 전송할 수 없습니다. 활성화 상태인지 체크해주세요.',
  STUDENT_MANAGEMENT_CARD_DETAIL_CONFLICT_WEEK = '이미 존재 하는 주차의 학생 관리 카드 상세 입니다.',
}

export enum EStudentManagementCardDetailHomeworkErrorMessage {
  STUDENT_MANAGEMENT_CARD_DETAIL_HOMEWORK_NOT_FOUND = '존재하지 않는 학생 관리 카드 숙제 입니다.',
}
