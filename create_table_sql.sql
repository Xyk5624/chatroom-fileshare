create table userinfo
(
	id bigint identity(1,1) not null PRIMARY key,
	username varchar(255) not null,
	password varchar(255) not null,
	email varchar(255) not null,
	avatar varchar(255)
)

CREATE unique INDEX UsernameIndex ON userinfo (username)


create table upload_files
(
	id bigint identity(1,1) not null PRIMARY key,
	filename varchar(255) not null,
	filepath varchar(255) not null,
	uploader varchar(255) not null,
	createtime datetime DEFAULT CURRENT_TIMESTAMP,  
)

CREATE unique INDEX PathIndex ON upload_files (filepath)


create table user_group
(
	id bigint identity(1,1) not null PRIMARY key,
	groupid bigint not null,
	userid bigint not null,
)

create table groups
(
	id bigint identity(1,1) not null PRIMARY key,
	groupname varchar(255) not null,
	creator varchar(255) not null,
	createtime datetime DEFAULT CURRENT_TIMESTAMP,  
)

CREATE unique INDEX GroupnameIndex ON groups (groupname)


create table upload_group_files
(
	id bigint identity(1,1) not null PRIMARY key,
	filename varchar(255) not null,
	filepath varchar(255) not null,
	uploader varchar(255) not null,
	groupid bigint not null,
	createtime datetime DEFAULT CURRENT_TIMESTAMP,  
)

CREATE unique INDEX PathIndex ON upload_group_files (filepath)

create table chat
(
	id bigint identity(1,1) not null PRIMARY key,
	chat_id varchar(255) not null,
	sender varchar(255) not null,
	type int not null,
	content text,
	filename varchar(255),
	filepath varchar(255),
	createtime datetime DEFAULT CURRENT_TIMESTAMP,  
)

CREATE INDEX ChatIdIndex ON chat (chat_id)
CREATE INDEX FilepathIndex ON chat (filepath)

create table group_chat
(
	id bigint identity(1,1) not null PRIMARY key,
	groupid bigint not null,
	sender varchar(255) not null,
	type int not null,
	content text,
	filename varchar(255),
	filepath varchar(255),
	createtime datetime DEFAULT CURRENT_TIMESTAMP,  
)

CREATE INDEX GroupIdIndex ON group_chat (groupid)
CREATE INDEX FilepathIndex ON group_chat (filepath)


create table friends
(
	id bigint identity(1,1) not null PRIMARY key,
	userid bigint not null,
	friend bigint,
	groupid bigint
)

CREATE INDEX UserIdIndex ON friends (userid)
CREATE INDEX FriendIndex ON friends (friend)
CREATE INDEX GroupIndex ON friends (groupid)
