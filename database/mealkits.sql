PGDMP  /    4                }            mealkits    17.4    17.4 ;    8           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            9           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            :           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            ;           1262    17058    mealkits    DATABASE     n   CREATE DATABASE mealkits WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE mealkits;
                     postgres    false            �            1259    25770    account    TABLE     w  CREATE TABLE public.account (
    user_id integer NOT NULL,
    password text NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    phone character varying(20),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone
);
    DROP TABLE public.account;
       public         heap r       postgres    false            �            1259    25769    account_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.account_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.account_user_id_seq;
       public               postgres    false    218            <           0    0    account_user_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.account_user_id_seq OWNED BY public.account.user_id;
          public               postgres    false    217            �            1259    25837    delivery    TABLE       CREATE TABLE public.delivery (
    delivery_id integer NOT NULL,
    order_id integer NOT NULL,
    delivery_status character varying(50) DEFAULT 'pending'::character varying,
    estimated_time timestamp without time zone,
    delivery_address text NOT NULL,
    s_firstname character varying(100) NOT NULL,
    s_lastname character varying(100) NOT NULL,
    s_phone character varying(20) NOT NULL,
    city character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.delivery;
       public         heap r       postgres    false            �            1259    25836    delivery_delivery_id_seq    SEQUENCE     �   CREATE SEQUENCE public.delivery_delivery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.delivery_delivery_id_seq;
       public               postgres    false    228            =           0    0    delivery_delivery_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.delivery_delivery_id_seq OWNED BY public.delivery.delivery_id;
          public               postgres    false    227            �            1259    25782 	   inventory    TABLE     9  CREATE TABLE public.inventory (
    meal_id integer NOT NULL,
    meal character varying(255) NOT NULL,
    description text,
    quantity integer DEFAULT 0,
    price numeric(10,2) NOT NULL,
    category character varying(100),
    dietary_options character varying(255),
    image_url character varying(500)
);
    DROP TABLE public.inventory;
       public         heap r       postgres    false            �            1259    25781    inventory_meal_id_seq    SEQUENCE     �   CREATE SEQUENCE public.inventory_meal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.inventory_meal_id_seq;
       public               postgres    false    220            >           0    0    inventory_meal_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.inventory_meal_id_seq OWNED BY public.inventory.meal_id;
          public               postgres    false    219            �            1259    25792    order    TABLE       CREATE TABLE public."order" (
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public."order";
       public         heap r       postgres    false            �            1259    25806 
   order_meal    TABLE     �   CREATE TABLE public.order_meal (
    order_meal_id integer NOT NULL,
    order_id integer NOT NULL,
    meal_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(10,2) NOT NULL
);
    DROP TABLE public.order_meal;
       public         heap r       postgres    false            �            1259    25805    order_meal_order_meal_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_meal_order_meal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.order_meal_order_meal_id_seq;
       public               postgres    false    224            ?           0    0    order_meal_order_meal_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.order_meal_order_meal_id_seq OWNED BY public.order_meal.order_meal_id;
          public               postgres    false    223            �            1259    25791    order_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.order_order_id_seq;
       public               postgres    false    222            @           0    0    order_order_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.order_order_id_seq OWNED BY public."order".order_id;
          public               postgres    false    221            �            1259    25824    plan    TABLE     �   CREATE TABLE public.plan (
    plan_id integer NOT NULL,
    user_id integer NOT NULL,
    subscription_plan character varying(100) NOT NULL,
    time_expired date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.plan;
       public         heap r       postgres    false            �            1259    25823    plan_plan_id_seq    SEQUENCE     �   CREATE SEQUENCE public.plan_plan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.plan_plan_id_seq;
       public               postgres    false    226            A           0    0    plan_plan_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.plan_plan_id_seq OWNED BY public.plan.plan_id;
          public               postgres    false    225            q           2604    25773    account user_id    DEFAULT     r   ALTER TABLE ONLY public.account ALTER COLUMN user_id SET DEFAULT nextval('public.account_user_id_seq'::regclass);
 >   ALTER TABLE public.account ALTER COLUMN user_id DROP DEFAULT;
       public               postgres    false    218    217    218            |           2604    25840    delivery delivery_id    DEFAULT     |   ALTER TABLE ONLY public.delivery ALTER COLUMN delivery_id SET DEFAULT nextval('public.delivery_delivery_id_seq'::regclass);
 C   ALTER TABLE public.delivery ALTER COLUMN delivery_id DROP DEFAULT;
       public               postgres    false    228    227    228            s           2604    25785    inventory meal_id    DEFAULT     v   ALTER TABLE ONLY public.inventory ALTER COLUMN meal_id SET DEFAULT nextval('public.inventory_meal_id_seq'::regclass);
 @   ALTER TABLE public.inventory ALTER COLUMN meal_id DROP DEFAULT;
       public               postgres    false    219    220    220            u           2604    25795    order order_id    DEFAULT     r   ALTER TABLE ONLY public."order" ALTER COLUMN order_id SET DEFAULT nextval('public.order_order_id_seq'::regclass);
 ?   ALTER TABLE public."order" ALTER COLUMN order_id DROP DEFAULT;
       public               postgres    false    222    221    222            x           2604    25809    order_meal order_meal_id    DEFAULT     �   ALTER TABLE ONLY public.order_meal ALTER COLUMN order_meal_id SET DEFAULT nextval('public.order_meal_order_meal_id_seq'::regclass);
 G   ALTER TABLE public.order_meal ALTER COLUMN order_meal_id DROP DEFAULT;
       public               postgres    false    224    223    224            z           2604    25827    plan plan_id    DEFAULT     l   ALTER TABLE ONLY public.plan ALTER COLUMN plan_id SET DEFAULT nextval('public.plan_plan_id_seq'::regclass);
 ;   ALTER TABLE public.plan ALTER COLUMN plan_id DROP DEFAULT;
       public               postgres    false    226    225    226            +          0    25770    account 
   TABLE DATA           z   COPY public.account (user_id, password, email, first_name, last_name, phone, address, created_at, last_login) FROM stdin;
    public               postgres    false    218   �G       5          0    25837    delivery 
   TABLE DATA           �   COPY public.delivery (delivery_id, order_id, delivery_status, estimated_time, delivery_address, s_firstname, s_lastname, s_phone, city, created_at) FROM stdin;
    public               postgres    false    228   7H       -          0    25782 	   inventory 
   TABLE DATA           v   COPY public.inventory (meal_id, meal, description, quantity, price, category, dietary_options, image_url) FROM stdin;
    public               postgres    false    220   �H       /          0    25792    order 
   TABLE DATA           U   COPY public."order" (order_id, user_id, total_price, status, order_date) FROM stdin;
    public               postgres    false    222   �I       1          0    25806 
   order_meal 
   TABLE DATA           \   COPY public.order_meal (order_meal_id, order_id, meal_id, quantity, unit_price) FROM stdin;
    public               postgres    false    224   NJ       3          0    25824    plan 
   TABLE DATA           ]   COPY public.plan (plan_id, user_id, subscription_plan, time_expired, created_at) FROM stdin;
    public               postgres    false    226   �J       B           0    0    account_user_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.account_user_id_seq', 11, true);
          public               postgres    false    217            C           0    0    delivery_delivery_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.delivery_delivery_id_seq', 9, true);
          public               postgres    false    227            D           0    0    inventory_meal_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.inventory_meal_id_seq', 1, false);
          public               postgres    false    219            E           0    0    order_meal_order_meal_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.order_meal_order_meal_id_seq', 57, true);
          public               postgres    false    223            F           0    0    order_order_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.order_order_id_seq', 35, true);
          public               postgres    false    221            G           0    0    plan_plan_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.plan_plan_id_seq', 1, false);
          public               postgres    false    225            �           2606    25780    account account_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);
 C   ALTER TABLE ONLY public.account DROP CONSTRAINT account_email_key;
       public                 postgres    false    218            �           2606    25778    account account_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (user_id);
 >   ALTER TABLE ONLY public.account DROP CONSTRAINT account_pkey;
       public                 postgres    false    218            �           2606    25846    delivery delivery_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.delivery
    ADD CONSTRAINT delivery_pkey PRIMARY KEY (delivery_id);
 @   ALTER TABLE ONLY public.delivery DROP CONSTRAINT delivery_pkey;
       public                 postgres    false    228            �           2606    25790    inventory inventory_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (meal_id);
 B   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_pkey;
       public                 postgres    false    220            �           2606    25812    order_meal order_meal_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.order_meal
    ADD CONSTRAINT order_meal_pkey PRIMARY KEY (order_meal_id);
 D   ALTER TABLE ONLY public.order_meal DROP CONSTRAINT order_meal_pkey;
       public                 postgres    false    224            �           2606    25799    order order_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (order_id);
 <   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_pkey;
       public                 postgres    false    222            �           2606    25830    plan plan_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.plan
    ADD CONSTRAINT plan_pkey PRIMARY KEY (plan_id);
 8   ALTER TABLE ONLY public.plan DROP CONSTRAINT plan_pkey;
       public                 postgres    false    226            �           1259    25852    idx_account_email    INDEX     F   CREATE INDEX idx_account_email ON public.account USING btree (email);
 %   DROP INDEX public.idx_account_email;
       public                 postgres    false    218            �           1259    25857    idx_delivery_order_id    INDEX     N   CREATE INDEX idx_delivery_order_id ON public.delivery USING btree (order_id);
 )   DROP INDEX public.idx_delivery_order_id;
       public                 postgres    false    228            �           1259    25858    idx_delivery_status    INDEX     S   CREATE INDEX idx_delivery_status ON public.delivery USING btree (delivery_status);
 '   DROP INDEX public.idx_delivery_status;
       public                 postgres    false    228            �           1259    25855    idx_order_meal_meal_id    INDEX     P   CREATE INDEX idx_order_meal_meal_id ON public.order_meal USING btree (meal_id);
 *   DROP INDEX public.idx_order_meal_meal_id;
       public                 postgres    false    224            �           1259    25854    idx_order_meal_order_id    INDEX     R   CREATE INDEX idx_order_meal_order_id ON public.order_meal USING btree (order_id);
 +   DROP INDEX public.idx_order_meal_order_id;
       public                 postgres    false    224            �           1259    25853    idx_order_user_id    INDEX     H   CREATE INDEX idx_order_user_id ON public."order" USING btree (user_id);
 %   DROP INDEX public.idx_order_user_id;
       public                 postgres    false    222            �           1259    25856    idx_plan_user_id    INDEX     D   CREATE INDEX idx_plan_user_id ON public.plan USING btree (user_id);
 $   DROP INDEX public.idx_plan_user_id;
       public                 postgres    false    226            �           2606    25847    delivery delivery_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.delivery
    ADD CONSTRAINT delivery_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."order"(order_id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.delivery DROP CONSTRAINT delivery_order_id_fkey;
       public               postgres    false    4744    222    228            �           2606    25818 "   order_meal order_meal_meal_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_meal
    ADD CONSTRAINT order_meal_meal_id_fkey FOREIGN KEY (meal_id) REFERENCES public.inventory(meal_id);
 L   ALTER TABLE ONLY public.order_meal DROP CONSTRAINT order_meal_meal_id_fkey;
       public               postgres    false    4741    224    220            �           2606    25813 #   order_meal order_meal_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_meal
    ADD CONSTRAINT order_meal_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."order"(order_id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.order_meal DROP CONSTRAINT order_meal_order_id_fkey;
       public               postgres    false    224    4744    222            �           2606    25800    order order_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(user_id);
 D   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_user_id_fkey;
       public               postgres    false    222    218    4738            �           2606    25831    plan plan_user_id_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.plan
    ADD CONSTRAINT plan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(user_id);
 @   ALTER TABLE ONLY public.plan DROP CONSTRAINT plan_user_id_fkey;
       public               postgres    false    4738    226    218            +   �   x�34�T1JT14R�K	-���I+��5�	*,(��K����6J�L7�77�t1uv2.�K��H�����(�LL���sH�M���K���L���L)M��!##S]3]#c#C+s+#=#c3�,W� ��#�      5   S   x�M˻�  ��n
�܇dF,$6�o���o5��ю�������&�rQ�F��uthwb�`1���_�R��G�? �      -   U  x����R� �3y
 iI���h/j��x�$���@�}zccG{�~�gd��N�,��-���١!/hZt�����T��s�%�S��`Z��5������	KS��B���Q�#�K�u6�2����C$2���Z.� =��h�^����˽��&�K�<�(��.�L�(�U���*�s`]ۃ&��2hg���i7��?�TF�v�+�����~��z�q
L|��En�W���J,��d9�8b�Fٔ�S��S��`yS�M{�?�f{8��5|�xP.�:�hf�?�5��Qkt�a��,���%�|U�i&RQTE»
J>xUE�(�����H      /   ?   x�36�44�424�3��L��K�,�MM�4202�50�52V02�2��26�313236����� Z��      1   0   x�35�46�4�4�44ҳ��25�@|0��7�8M@1z\\\ �3      3      x������ � �     