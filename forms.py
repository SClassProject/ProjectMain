from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FileField
from wtforms.validators import DataRequired, Length, Email, EqualTo

class RegistrationForm(FlaskForm):
    userNumber = StringField("학번", validators=[DataRequired(), Length(min=5,max=10)])
    password = PasswordField("비밀번호", validators=[DataRequired(), Length(min=4, max=20)])
    confirm_password = PasswordField("비밀번호 확인", validators=[DataRequired(), EqualTo("password")])
    name = StringField("이름", validators=[DataRequired(), Length(min=1,max=10)])
    email = StringField("이메일",validators=[DataRequired(),Email()])
    submit = SubmitField("가입")

class roomRegistration(FlaskForm):
    className = StringField("클래스 이름", validators=[DataRequired(), Length(min=1,max=20)])
    classpwd = StringField("클래스 비밀번호", validators=[DataRequired(), Length(min=4,max=10)])
    submit = SubmitField("클래스 생성")

class loginRegistration(FlaskForm):
    userID = StringField("학번", validators=[DataRequired(), Length(min=5,max=10)])
    userPWD = PasswordField("비밀번호",  validators=[DataRequired(), Length(min=4,max=20)])
    submit = SubmitField("로그인")